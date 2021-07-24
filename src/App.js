import "./App.css";
import { Card, Space, Spin, Typography } from 'antd';
import TokenSearch from "./components/TokenSearch";
import { useEffect, useState } from "react";
import ChainSelect from "./components/ChainSelect";
import { ExperimentOutlined } from '@ant-design/icons';
import checkHoneypot from "./actions/checkHoneypot";
const { Text } = Typography;
const interpretations = {
  "UNKNOWN": "The status of this token is unknown.", // 0, unknown
  "OK": "✅ Honey pot tests passed. Our program was able to buy and sell it succesfully.\n This however does not guarantee that it is not a honeypot.", // 1, no issues
  "NO_PAIRS": "⚠️ Could not find any trading pair for this token on the default router and could thus not test it.", // 2, no pairs found
  "SEVERE_FEE": "⚠️ A severely high trading fee (over 50%) was detected when selling or buying this token.", //  3, fee > 50%
  "HIGH_FEE": "⚠️ A high trading fee was detected when selling or buying this token.", //  4, fee > 20%
  "MEDIUM_FEE": "⚠️ A trading fee of over 10% was detected when selling or buying this token.", // 5, fee > 10%
  "APPROVE_FAILED": "🚨 Failed to approve the token. This is very likely a honeypot.", // 6, approval failed
  "SWAP_FAILED": "🚨 Failed to sell the token. This is very likely a honeypot." // 7, swap failed
}

const doCheckHoneypot = checkHoneypot();

function App() {
  const [tokenAddress, setTokenAddress] = useState(undefined);
  const [chain, setChain] = useState("bsc");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(undefined);

  const onStart = async (tokenAddress_) => {
    setTokenAddress(tokenAddress_); 
    if (
      tokenAddress_ === undefined ||
      chain === undefined || loading) {
      return;
    }
    setLoading(true);
    doCheckHoneypot(tokenAddress_, chain).then(s => {
      setStatus(s);
      setLoading(false);
    });
  };

  const onSelect = async (chain_) => {
    console.log(chain_);
    setChain(chain_)
  };

  return (

    <div className="App">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div style={{ display: "flex" }}>
          <div style={{ width: "180px", marginRight: "5px" }}>
            <ChainSelect onSelect={onSelect} disabled={loading}/>
          </div>
          <div style={{ flexGrow: 1 }}>
            <TokenSearch onStart={onStart} disabled={loading}/>
          </div>
        </div>
        <Card title="Token status" bordered={false} style={{ width: "100%" }}>
          <ExperimentOutlined style={{ fontSize: 70, marginBottom: "40px" }} />
          {loading ? <div><Spin/></div> : <></>}
          {status == undefined ?
            <div style={{ color: '#6d84a2' }}>
              <p>Please select a token and chain to get started...</p>
              <p></p>
              <p>This is an experimental service, use at your own risk and make sure to double check all contract interactions.</p>
            </div>
            :
            <div>
               <Text code style={{fontSize: "16px"}}>{interpretations[status]}</Text>
            </div>
          }
        </Card>
      </Space>
    </div>
  );
}

export default App;
