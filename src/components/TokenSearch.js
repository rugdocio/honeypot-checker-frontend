import { Input } from "antd";

const { Search } = Input;

// Masterchef input component that calls the injected onStart method with the masterchef address as parameter
function TokenSearch(props) {
  const { onStart, disabled } = props;
  return (
    <Search
      placeholder="Enter Token Address"
      allowClear
      enterButton="Start"
      size="large"
      onSearch={onStart}
      disabled={disabled}
    />
  );
}

export default TokenSearch;
