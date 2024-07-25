import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tag } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import useListImportLogs from "../../hooks/useListImportLogs.mjs";

import styles from "./LogsPage.module.css";

const LogsPage = () => {
  const {
    importsList,
    importsListIsLoading,
    importsListIsError,
    refetchImportsList,
  } = useListImportLogs();

  const navigate = useNavigate();

  const tableData = importsList?.map((log) => {
    return {
      key: log.importId,
      domain: log.domain,
      importDate: log.importDate,
      status: log.importStatus,
      message: log.statusMessage,
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
    complete: { color: "green", label: "Complete" },
    pending: { color: "orange", label: "Pending" },
    failed: { color: "red", label: "Failed" },
  };

  const tableColumns = [
    {
      title: "Date / Time",
      dataIndex: "importDate",
      key: "importDate",
      render: (importDate) => formatDate(new Date(importDate)),
    },
    {
      title: "Domain",
      dataIndex: "domain",
      key: "domain",
    },
    {
      title: "Import Type",
      dataIndex: "importType",
      key: "importType",
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
      title: "Status Message",
      dataIndex: "message",
      key: "message",
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
    <div style={{ margin: "1rem 3rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <h3>Recent Logs</h3>
        <Button onClick={refetchImportsList}>
          <ReloadOutlined />
        </Button>
      </div>
      {importsListIsLoading && <div>Loading...</div>}
      {importsListIsError && <div>Error fetching logs</div>}
      {importsList && (
        <div className={styles.previewListContainer}>
          <Table
            columns={tableColumns}
            dataSource={tableData}
            pagination={true}
          />
        </div>
      )}
    </div>
  );
};

export default LogsPage;
