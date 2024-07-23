import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tag } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import useListImportLogs from "../../hooks/useListImportLogs.mjs";

import styles from "./LogListPreview.module.css";

const LogListPreview = () => {
  const { logsList, logsListIsLoading, logsListIsError, refetchLogsList } =
    useListImportLogs();

  const navigate = useNavigate();

  const tableData = logsList?.map((log) => {
    return {
      key: log.importId,
      domain: log.domain,
      importDate: log.importDate,
      status: log.status,
      importType: log.importType,
      importId: log.importId,
    };
  });

  const formatDate = (date) => {
    return new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  const tableTags = {
    completed: { color: "green", label: "Completed" },
    "in-progress": { color: "blue", label: "In Progress" },
    pending: { color: "orange", label: "Pending" },
    failed: { color: "red", label: "Failed" },
  };

  const tableColumns = [
    {
      title: "Domain",
      dataIndex: "domain",
      key: "domain",
    },
    {
      title: "Date / Time",
      dataIndex: "importDate",
      key: "importDate",
      render: (importDate) => formatDate(new Date(importDate)),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const tag = tableTags[status];
        return tag ? (
          <Tag color={tag.color}>{tag.label}</Tag>
        ) : (
          <Tag color="gray">Unknown</Tag>
        );
      },
    },
    {
      title: "Import Type",
      dataIndex: "importType",
      key: "importType",
    },
    {
      title: "Actions",
      dataIndex: "importId",
      key: "actions",
      render: (importId) => (
        <Button onClick={() => navigate(`/log/${importId}`)}>View Log</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <h3>Recent Logs</h3>
        <Button onClick={refetchLogsList}>
          <ReloadOutlined />
        </Button>
      </div>
      {logsListIsLoading && <div>Loading...</div>}
      {logsListIsError && <div>Error fetching logs</div>}
      {logsList && (
        <div className={styles.previewListContainer}>
          <Table
            columns={tableColumns}
            dataSource={tableData.slice(0, 5)}
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default LogListPreview;