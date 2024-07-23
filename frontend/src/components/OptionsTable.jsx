import React from "react";
import { Table, Input, Select, Checkbox, Typography } from "antd";

const { Title } = Typography;
const { Option } = Select;

const OptionsTable = ({ options, importOptions, handleOptionChange }) => {
  const columns = [
    {
      title: "Option",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Control",
      dataIndex: "control",
      key: "control",
      render: (control) => control,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <div style={{ maxWidth: "600px" }}>{text}</div>,
    },
  ];

  const data = Object.keys(options).map((optionKey, index) => {
    const optionConfig = options[optionKey];
    let controlElement;
    switch (optionConfig.type) {
      case "boolean":
        controlElement = (
          <Checkbox
            checked={importOptions[optionKey]}
            onChange={(e) => handleOptionChange(optionKey, e.target.checked)}
          />
        );
        break;
      case "dropdown":
        controlElement = (
          <Select
            value={importOptions[optionKey]}
            onChange={(value) => handleOptionChange(optionKey, value)}
          >
            {optionConfig.options.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
        break;
      case "string":
      case "integer":
        controlElement = (
          <Input
            type={optionConfig.type === "integer" ? "number" : "text"}
            value={importOptions[optionKey]}
            onChange={(e) =>
              handleOptionChange(
                optionKey,
                optionConfig.type === "integer"
                  ? parseInt(e.target.value, 10)
                  : e.target.value
              )
            }
          />
        );
        break;
      default:
        controlElement = null;
    }
    return {
      key: index,
      label: optionConfig.label,
      control: controlElement,
      description: optionConfig.description,
    };
  });

  return (
    options && (
      <div style={{ marginTop: "1em" }}>
        <Title level={3}>Import Options</Title>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
        />
      </div>
    )
  );
};

export default OptionsTable;
