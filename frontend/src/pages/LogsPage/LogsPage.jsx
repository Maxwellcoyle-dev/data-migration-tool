import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tag, Popconfirm } from "antd";
import { ReloadOutlined, DeleteOutlined } from "@ant-design/icons";

// Hooks
import useListImportLogs from "../../hooks/useListImportLogs.js";
import useDeleteImport from "../../hooks/useDeleteImport.js";

// Styles
import styles from "./LogsPage.module.css";

const LogsPage = ({ user }) => {
  const {
    importsList,
    importsListIsLoading,
    importsListIsError,
    refetchImportsList,
  } = useListImportLogs();

  const { deleteImportAsync, deleteImportIsPending } = useDeleteImport(
    user.userId
  );

  const navigate = useNavigate();

  const tableData = importsList?.map((log) => {
    return {
      key: log.importId,
      domain: log.domain,
      importDate: log.importDate,
      status: log.importStatus,
      message: log.statusMessage,
      fileName: log.fileName,
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
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Actions",
      dataIndex: "importId",
      key: "actions",
      render: (importId, status) => (
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Button onClick={() => navigate(`/log/${importId}`)}>View</Button>
          <Popconfirm
            title="Are you sure you want to delete this import?"
            onConfirm={() => deleteImportAsync(importId)}
            okText="Delete"
            okType="danger"
            okButtonProps={{ loading: deleteImportIsPending }}
            cancelText="Cancel"
            placement="left"
          >
            <Button
              danger
              disabled={status === "pending"}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
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
