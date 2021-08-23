import { Select } from 'antd';

const { Option } = Select;

function ChainSelect(props) {
    const { onSelect, disabled } = props;
    return <Select defaultValue="bsc" style={{ width: "100%", height:"100%"}} onChange={onSelect} disabled={disabled}>
        <Option value="bsc">Binance Smart Chain</Option>
        <Option value="poly">Polygon</Option>
        <Option value="avax">Avalanche</Option>
        <Option value="eth">Ethereum</Option>
    
    </Select>

}

export default ChainSelect;