import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Tag,
  Button,
  Input,
  Descriptions,
  Collapse,
  Spin,
  Alert,
  Empty,
} from "antd";
import {
  DownloadOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import useGetImport from "../../hooks/useGetImport";
import useListImportLogs from "../../hooks/useListImportLogs.js";

import styles from "./Log.module.css";

const { Panel } = Collapse;

const Log = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [tableSorter, setTableSorter] = useState({});

  const { id } = useParams();
  useEffect(() => {
    console.log("id", id);
  }, [id]);

  const { importData, importIsLoading, importIsError, refetchImport } =
    useGetImport(id);

  useEffect(() => {
    if (importData) {
      console.log("importData", importData);
    }
  }, [importData]);

  useEffect(() => {
    console.log("importData", importData);
    setFilteredData(
      Array.isArray(importData?.jsonLogs) ? importData.jsonLogs : []
    );
  }, [importData]);

  const keys = Object.keys(importData?.jsonLogs?.[0] || {});

  const columns = keys.map((key) => {
    if (key === "success") {
      return {
        title: "Status",
        dataIndex: key,
        key: key,
        filters: [
          { text: "Success", value: true },
          { text: "Failure", value: false },
        ],
        onFilter: (value, record) => record[key] === value,
        filteredValue: tableFilters.success || null,
        render: (success) => (
          <Tag color={success ? "green" : "red"}>
            {success ? "Success" : "Failure"}
          </Tag>
        ),
      };
    } else if (key === "message") {
      return {
        title: key.replace(/_/g, " ").toUpperCase(),
        dataIndex: key,
        key: key,
        sorter: (a, b) => a[key].localeCompare(b[key]),
        filteredValue: tableFilters.message || null,
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Search ${key}`}
              value={selectedKeys[0]} // Single input for search text
              onChange={(e) =>
                setSelectedKeys([
                  e.target.value,
                  selectedKeys[1] || false, // Preserve exclude state
                ])
              }
              onPressEnter={confirm}
              style={{ marginBottom: 8, display: "block" }}
            />
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <input
                type="checkbox"
                id="exclude"
                checked={selectedKeys[1] || false} // Ensure it defaults to false
                onChange={
                  (e) =>
                    setSelectedKeys([selectedKeys[0] || "", e.target.checked]) // Update the second value with checkbox state
                }
              />
              <label htmlFor="exclude" style={{ marginLeft: 8 }}>
                Exclude
              </label>
            </div>
            <Button
              type="primary"
              onClick={confirm}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        ),
        // Removed onFilter
      };
    } else {
      return {
        title: key.replace(/_/g, " ").toUpperCase(),
        dataIndex: key,
        key: key,
        sorter: (a, b) => (a[key] > b[key] ? 1 : -1),
        sortOrder: tableSorter.field === key ? tableSorter.order : null,
      };
    }
  });

  const handleTableChange = (pagination, filters, sorter) => {
    let filtered = [...(importData?.jsonLogs || [])];

    // Handle 'success' filters
    if (filters.success) {
      filtered = filtered.filter((item) =>
        filters.success.includes(item.success)
      );
    }

    // Handle 'message' filters with 'exclude' logic
    if (filters.message && filters.message.length > 0) {
      const searchTerm = filters.message[0]?.toLowerCase() || "";
      const exclude = filters.message[1] || false;

      if (searchTerm) {
        if (exclude) {
          // Exclude messages that include the search term
          filtered = filtered.filter(
            (item) => !item.message.toLowerCase().includes(searchTerm)
          );
        } else {
          // Include only messages that include the search term
          filtered = filtered.filter((item) =>
            item.message.toLowerCase().includes(searchTerm)
          );
        }
      }
    }

    // Handle sorting
    if (sorter.order) {
      filtered = filtered.sort((a, b) => {
        if (a[sorter.field] > b[sorter.field])
          return sorter.order === "ascend" ? 1 : -1;
        if (a[sorter.field] < b[sorter.field])
          return sorter.order === "ascend" ? -1 : 1;
        return 0;
      });
    }

    setTableFilters(filters);
    setTableSorter(sorter);
    setFilteredData(filtered);
  };

  const resetFiltersAndSorting = () => {
    setTableFilters({});
    setTableSorter({});
    setFilteredData(importData?.jsonLogs || []);
  };

  const downloadAllLogs = () => {
    const url = importData.presignedUrl;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "import_log_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCSV = () => {
    const csvData = convertToCSV(filteredData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (objArray) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = `${keys.join(",")}\r\n`;

    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in keys) {
        if (line !== "") line += ",";
        line += array[i][keys[index]];
      }
      str += `${line}\r\n`;
    }
    return str;
  };

  const formatDate = (date) => {
    console.log("date", date);
    return new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(new Date(date));
  };

  if (importIsError) {
    return (
      <div className={styles.logTableContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Alert
            message="Error"
            description="Failed to load log data."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.logTableContainer}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h3>Log Data</h3>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Button icon={<ReloadOutlined />} onClick={refetchImport}>
            Refresh
          </Button>

          <Button
            onClick={downloadCSV}
            disabled={!filteredData.length}
            icon={<DownloadOutlined />}
          >
            Download Current Logs
          </Button>

          <Button
            onClick={downloadAllLogs}
            disabled={!importData?.presignedUrl}
            icon={<DownloadOutlined />}
          >
            Download All Logs
          </Button>
          <Button
            onClick={resetFiltersAndSorting}
            disabled={!filteredData.length}
            icon={<ReloadOutlined />}
          >
            Reset Filters & Sorting
          </Button>
        </div>
      </div>
      <Collapse defaultActiveKey={[1]}>
        <Panel header="Import Metadata" key="1">
          {importIsLoading && (
            <div className={styles.logTableContainer}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Spin tip="Loading..." />
              </div>
            </div>
          )}
          {importData && (
            <Descriptions title="Import Metadata" bordered column={1}>
              <Descriptions.Item label="Import Type">
                {importData.importItem.importType.S}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {importData.importItem.importStatus.S}
              </Descriptions.Item>
              <Descriptions.Item label="Status Message">
                {importData.importItem.statusMessage.S}
              </Descriptions.Item>
              <Descriptions.Item label="Domain">
                {importData.importItem.domain.S}
              </Descriptions.Item>
              <Descriptions.Item label="Import Date">
                {formatDate(importData.importItem.importDate.S)}
              </Descriptions.Item>
              <Descriptions.Item label="File Name">
                {importData.importItem.fileName.S}
              </Descriptions.Item>
              {importData.importItem.chunkCount?.N && (
                <Descriptions.Item label="Chunk Count">
                  {importData.importItem.chunkCount.N}
                </Descriptions.Item>
              )}
              {importData.importItem.importOptions?.S && (
                <Descriptions.Item label="Import Options">
                  {importData.importItem.importOptions.S}
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Panel>
      </Collapse>

      {importData && (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="row_index"
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Empty
                description={
                  importData?.statusMessage
                    ? `${importData.statusMessage}`
                    : "No Log Data"
                }
              />
            ),
          }}
        />
      )}
    </div>
  );
};

export default Log;
