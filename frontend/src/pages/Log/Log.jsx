import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Tag, Button, Input, Descriptions, Collapse } from "antd";
import {
  DownloadOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import useGetLog from "../../hooks/useGetLog";

import styles from "./Log.module.css";

const { Panel } = Collapse;

const Log = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [tableSorter, setTableSorter] = useState({});

  const { id } = useParams();
  const { logData, logIsLoading, logIsError, refetchLog } = useGetLog(id);

  useEffect(() => {
    console.log("logData", logData);
    setFilteredData(logData?.logContent);
  }, [logData]);

  const metadata = {
    importType: { S: "branches" },
    status: { S: "completed" },
    chunkCount: { N: "1" },
    importDate: { S: "2024-07-16T16:40:42.535Z" },
    importOptions: { S: '{"update":false}' },
    domain: { S: "traintopia.docebosaas.com" },
  };

  const keys = Object.keys(logData?.logContent[0] || {});

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
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={confirm}
              style={{ marginBottom: 8, display: "block" }}
            />
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
        onFilter: (value, record) =>
          record[key].toString().toLowerCase().includes(value.toLowerCase()),
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
    let filtered = [...logData?.logContent];

    if (filters.success) {
      filtered = filtered.filter((item) =>
        filters.success.includes(item.success)
      );
    }

    if (filters.message && filters.message.length) {
      filtered = filtered.filter((item) =>
        item.message.toLowerCase().includes(filters.message[0].toLowerCase())
      );
    }

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
    setFilteredData(logData?.logContent);
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
        <div>
          <Button
            onClick={downloadCSV}
            icon={<DownloadOutlined />}
            style={{ marginRight: "8px" }}
          >
            Download CSV
          </Button>
          <Button onClick={resetFiltersAndSorting} icon={<ReloadOutlined />}>
            Reset Filters & Sorting
          </Button>
        </div>
      </div>
      <Collapse defaultActiveKey={[]}>
        <Panel header="Import Metadata" key="1">
          <Descriptions title="Import Metadata" bordered column={1}>
            <Descriptions.Item label="Import Type">
              {metadata?.importType.S}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {metadata?.status?.S}
            </Descriptions.Item>
            <Descriptions.Item label="Chunk Count">
              {metadata?.chunkCount?.N}
            </Descriptions.Item>
            <Descriptions.Item label="Import Date">
              {formatDate(metadata?.importDate?.S)}
            </Descriptions.Item>
            <Descriptions.Item label="Domain">
              {metadata?.domain?.S}
            </Descriptions.Item>
            <Descriptions.Item label="Import Options">
              {metadata?.importOptions?.S}
            </Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>

      <Table
        columns={columns}
        dataSource={logData?.logContent}
        rowKey="row_index"
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Log;
