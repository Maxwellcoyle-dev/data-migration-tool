import React, { useEffect, useState } from "react";
import { Collapse, Table, Button, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const DataImportResults = ({ results }) => {
  const [activeKey, setActiveKey] = useState("1");
  const [successResults, setSuccessResults] = useState([]);
  const [failureResults, setFailureResults] = useState([]);

  useEffect(() => {
    const successes = results.filter((item) => item.success);
    const failures = results.filter((item) => !item.success);
    setSuccessResults(successes);
    setFailureResults(failures);
    setActiveKey(successes.length >= failures.length ? "1" : "2");
  }, [results]);

  const getColumns = (data) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key,
      render: (text) => (typeof text === "boolean" ? text.toString() : text),
    }));
  };

  const normalizeMessage = (message) => {
    if (!message) return "";
    return message.replace(/code \w+|exists: .*/, ""); // Adjust this regex based on error message patterns
  };

  const aggregateResults = (data) => {
    const messageMap = data.reduce((acc, item) => {
      const normalizedMessage = normalizeMessage(item.message);
      if (!acc[normalizedMessage]) {
        acc[normalizedMessage] = { count: 0, items: [] };
      }
      acc[normalizedMessage].count += 1;
      acc[normalizedMessage].items.push(item);
      return acc;
    }, {});

    return Object.keys(messageMap).map((message) => ({
      message,
      count: messageMap[message].count,
      items: messageMap[message].items,
    }));
  };

  const successAggregated = aggregateResults(successResults);
  const failureAggregated = aggregateResults(failureResults);

  const downloadCSV = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const blob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      {
        type: "application/octet-stream",
      }
    );
    saveAs(blob, `${filename}.xlsx`);
  };

  const items = [
    {
      key: "1",
      label: `Successes (${successResults.length})`,
      children: (
        <>
          <Table
            columns={getColumns(successResults)}
            dataSource={successResults}
            rowKey="row_index"
            pagination={{ pageSize: 50 }}
            scroll={{ y: 400 }}
          />
          <Space
            direction="vertical"
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
            }}
          >
            {successAggregated.map(({ message, count }, index) => (
              <Button
                key={`${message}-${index}`}
                icon={<DownloadOutlined />}
                size="small"
              >
                {`${message} (${count})`}
              </Button>
            ))}
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadCSV(successResults, "success_logs")}
            >
              Download Success Logs
            </Button>
          </Space>
        </>
      ),
    },
    {
      key: "2",
      label: `Failures (${failureResults.length})`,
      children: (
        <>
          <Table
            columns={getColumns(failureResults)}
            dataSource={failureResults}
            rowKey="row_index"
            pagination={{ pageSize: 50 }}
            scroll={{ y: 400 }}
          />
          <Space
            direction="vertical"
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
            }}
          >
            {failureAggregated.map(({ message, count }, index) => (
              <Button
                key={`${message}-${index}`}
                icon={<DownloadOutlined />}
                size="small"
              >
                {`${message} (${count})`}
              </Button>
            ))}
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => downloadCSV(failureResults, "failure_logs")}
            >
              Download Failure Logs
            </Button>
          </Space>
        </>
      ),
    },
  ];

  return (
    <Collapse activeKey={activeKey} onChange={setActiveKey} items={items} />
  );
};

export default DataImportResults;
