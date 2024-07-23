import React from "react";
import { Table, Typography, Empty } from "antd";
import OptionsTable from "./OptionsTable";

const { Title } = Typography;

const CSVPreview = ({
  csvData,
  options,
  importOptions,
  handleOptionChange,
}) => {
  const columns = React.useMemo(
    () =>
      Object.keys(csvData[0] || {}).map((key) => ({
        title: key,
        dataIndex: key,
        render: (value) => {
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
          }
          if (typeof value === "string" && value.length > 30) {
            return `${value.substring(0, 50)}...`;
          }
          return value;
        },
      })),
    [csvData]
  );

  const data = React.useMemo(
    () => csvData.slice(0, 2).map((item, index) => ({ ...item, key: index })),
    [csvData]
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Title level={3}>CSV Preview</Title>
      <div style={{ overflowX: "scroll", width: "100%" }}>
        {csvData.length === 0 ? (
          <Empty
            description="No data to preview"
            style={{ minHeight: "15rem" }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            style={{ marginBottom: "1em" }}
          />
        )}
      </div>

      <OptionsTable
        options={options}
        importOptions={importOptions}
        handleOptionChange={handleOptionChange}
      />
    </div>
  );
};

export default CSVPreview;
