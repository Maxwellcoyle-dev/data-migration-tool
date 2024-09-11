import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tag, Popconfirm } from "antd";
import { ReloadOutlined, DeleteOutlined } from "@ant-design/icons";

// Hooks
import useListImportLogs from "../../hooks/useListImportLogs.js";
import useDeleteImport from "../../hooks/useDeleteImport.js";

import styles from "./LogListPreview.module.css";

const LogListPreview = ({ user }) => {
  const {
    importsList,
    importsListIsLoading,
    importsListIsError,
    refetchImportsList,
  } = useListImportLogs();

  const { deleteImport, deleteImportIsPending } = useDeleteImport(user.userId);

  const navigate = useNavigate();

  const tableData = importsList?.map((log) => {
    return {
      key: log.importId,
      domain: log.domain,
      importDate: log.importDate,
      fileName: log.fileName,
      importStatus: log.importStatus,
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
      dataIndex: "importStatus",
      key: "importStatus",
      render: (importStatus) => {
        const tag = tableTags[importStatus];
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
      render: (importId, importStatus) => (
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Button onClick={() => navigate(`/log/${importId}`)}>View</Button>
          <Popconfirm
            title="Are you sure you want to delete this import?"
            onConfirm={() => deleteImport(importId)}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
            okButtonProps={{ loading: deleteImportIsPending }}
            placement="left"
          >
            <Button
              danger
              disabled={importStatus === "pending"}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
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
