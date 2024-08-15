import React from "react";
import { Collapse, Table, Typography, Button, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Title } = Typography;

const FieldRenderer = ({ importType, fieldsVisible, typeFields }) => {
  const handleDownload = () => {
    const filePath = require(`../csv-templates/${importType}.csv`);
    const link = document.createElement("a");
    link.href = filePath;
    link.download = `${importType}.csv`;
    link.click();
  };

  return (
    <Collapse
      size="large"
      style={{ border: "1px solid lightgray" }}
      expandIconPosition="start"
      defaultActiveKey={fieldsVisible ? ["1"] : []}
    >
      <Panel
        header={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            CSV schema for import type:<Tag>{importType}</Tag>
          </div>
        }
        key="1"
      >
        <div style={{ marginTop: 10 }}>
          <Button
            type="dashed"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{ marginLeft: "auto" }}
          >
            Download CSV Template
          </Button>
          {renderFields(typeFields.requiredFields, "Required Fields")}
          {renderFields(typeFields.optionalFields, "Optional Fields")}
        </div>
      </Panel>
    </Collapse>
  );
};

const renderFields = (fields, title) => (
  <div>
    <Title level={4}>{title}</Title>
    <Table
      dataSource={fields}
      columns={[
        { title: "Field", dataIndex: "field", key: "field" },
        { title: "Type", dataIndex: "type", key: "type" },
        { title: "Description", dataIndex: "description", key: "description" },
      ]}
      rowKey="field"
      pagination={false}
      bordered
    />
  </div>
);

export default FieldRenderer;
