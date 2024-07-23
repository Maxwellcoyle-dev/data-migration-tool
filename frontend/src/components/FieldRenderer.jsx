import React from "react";
import { Collapse, Table, Typography } from "antd";

const { Panel } = Collapse;
const { Title } = Typography;

const FieldRenderer = ({ importType, fieldsVisible, typeFields }) => (
  <Collapse
    size="large"
    style={{ border: "1px solid lightgray" }}
    expandIconPosition="start"
    defaultActiveKey={fieldsVisible ? ["1"] : []}
  >
    <Panel
      header={
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <strong>{importType}</strong> fields
        </div>
      }
      key="1"
    >
      <div style={{ marginTop: 10 }}>
        {renderFields(typeFields.requiredFields, "Required Fields")}
        {renderFields(typeFields.optionalFields, "Optional Fields")}
      </div>
    </Panel>
  </Collapse>
);

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
