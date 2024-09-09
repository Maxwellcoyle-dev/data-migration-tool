import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tag } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import useListImportLogs from "../../hooks/useListImportLogs.js";

import styles from "./LogListPreview.module.css";

const LogListPreview = () => {
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
      fileName: log.fileName,
      status: log.importStatus,
      statusMessage: log.statusMessage,
      importType: log.importType,
      importId: log.importId,
    };
  });

  useEffect(() => {
    console.log("importsList", importsList);
  }, [importsList]);

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
    "in-progress": { color: "blue", label: "In Progress" },
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
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
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
      dataIndex: "statusMessage",
      key: "statusMessage",
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
            dataSource={tableData.slice(0, 5)}
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default LogListPreview;
