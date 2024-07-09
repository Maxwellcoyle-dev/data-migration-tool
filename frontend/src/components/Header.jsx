import React from "react";
import { Select, Typography } from "antd";

const { Title } = Typography;
const { Option } = Select;

const Header = ({ importType, handleImportTypeSelect, typeFields }) => (
  <div>
    <Title level={2}>Docebo - CSV Data Importer</Title>
    <div style={{ display: "flex", alignItems: "center" }}>
      <Title level={3} style={{ margin: 0 }}>
        Choose Import Type:
      </Title>
      <Select
        style={{ marginLeft: 10, width: 200 }}
        value={importType}
        onChange={handleImportTypeSelect}
      >
        {Object.keys(typeFields).map((type) => (
          <Option key={type} value={type}>
            {type}
          </Option>
        ))}
      </Select>
    </div>
  </div>
);

export default Header;
