import "./App.css";
import { Card, Space, Spin, Typography } from 'antd';
import TokenSearch from "./components/TokenSearch";
import { useState } from "react";
import ChainSelect from "./components/ChainSelect";
import { ExperimentOutlined } from '@ant-design/icons';
import checkHoneypot from "./actions/checkHoneypot";
import checkVerified from "./actions/checkVerified";

import graylist from "./GrayList";

const { Text } = Typography;
const interpretations = {
  "UNKNOWN": <span>The status of this token is unknown. This is usually a system error but could also be a bad sign for the token. Be careful.</span>, // 0, unknown
  "OK": <span><b>✅ Honeypot tests passed</b>. Our program was able to buy and sell it succesfully. This however does not guarantee that it is not a honeypot.</span>, // 1, no issues
  "NO_PAIRS": <span>⚠️ Could not find any trading pair for this token on the default router and could thus not test it.</span>, // 2, no pairs found
  "SEVERE_FEE": <span>⚠️ A <b>severely high trading fee</b> (over 50%) was detected when selling or buying this token.</span>, //  3, fee > 50%
  "HIGH_FEE": <span>⚠️ A <b>high trading fee</b> (Between 20% and 50%) was detected when selling or buying this token. Our system was however able to sell the token again.</span>, //  4, fee > 20%
  "MEDIUM_FEE": <span>⚠️ A <b>trading fee of over 10%</b> but less then 20% was detected when selling or buying this token. Our system was however able to sell the token again.</span>, // 5, fee > 10%
  "APPROVE_FAILED": <span>🚨 Failed to approve the token. This is very likely a <b>honeypot</b>.</span>, // 6, approval failed
  "SWAP_FAILED": <span>🚨 Failed to sell the token. This is very likely a <b>honeypot</b>.</span> // 7, swap failed
}

const verifiedMessage = {
  true: <span>The contract is verified</span>,
  false: <span>🚨 The contract is <b>not verified</b>. This is usually a very bad sign.</span>
}

const doCheckHoneypot = checkHoneypot();
const doCheckVerified = checkVerified();


function App() {
  const [chain, setChain] = useState("bsc");

  const [loadingHoneypot, setLoadingHoneypot] = useState(false);
  const [loadingVerified, setLoadingVerified] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [verified, setVerified] = useState(undefined);

  const onStart = async (tokenAddress_) => {
    if (
      tokenAddress_ === undefined ||
      chain === undefined || loadingVerified || loadingHoneypot) {
      return;
    }
    
    if (chain !== "avax") {
      setLoadingVerified(true);
      doCheckVerified(tokenAddress_, chain).then(s => {
        setVerified(s);
        setLoadingVerified(false);
      });
    }

    if(isGraylisted(chain, tokenAddress_)) {
      setStatus("UNKNOWN");
      return;
    }

    setLoadingHoneypot(true);
    doCheckHoneypot(tokenAddress_, chain).then(s => {
      setStatus(s);
      setLoadingHoneypot(false);
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
            <ChainSelect onSelect={onSelect} disabled={loadingHoneypot || loadingVerified} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <TokenSearch onStart={onStart} disabled={loadingHoneypot || loadingVerified} />
          </div>
        </div>
        <Card title="Token status" bordered={false} style={{ width: "100%", backgroundColor: "transparent" }}>
          <ExperimentOutlined style={{ fontSize: 70, marginBottom: "40px", color: '#6d84a2' }} />
          {loadingHoneypot || loadingVerified ? <div><Spin /></div> : <></>}
          {status === undefined ?
            <div style={{ color: '#6d84a2' }}>
              <p>Please select a token and chain to get started...</p>
              <p></p>
              <p>This is an experimental service, use at your own risk and make sure to double check all contract interactions.</p>
            </div>
            :
            <div>
              <Text code style={{ fontSize: "16px" }}>{interpretations[status]}</Text>
            </div>
          }
          {verified === undefined ? <></> : <div style={{ marginTop: "10px" }}>
            <Text code style={{ fontSize: "16px" }}>{verifiedMessage[verified]}</Text>
          </div>}
        </Card>
      </Space>
    </div>
  );
}

function isGraylisted(chain, address) {
  if (!(chain in graylist))
    return false;
  const chainGraylist = graylist[chain];
  if(!(address.lower() in chainGraylist))
    return false;
  return chainGraylist[address.lower()];
}

export default App;
