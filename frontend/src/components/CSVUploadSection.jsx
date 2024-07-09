import React from "react";
import { Button, Space, Alert, Spin } from "antd";
import CSVUploader from "../components/CSVUploader.jsx";
import { IoIosCheckmarkCircle, IoMdWarning } from "react-icons/io";

const CSVUploadSection = ({
  handleUpload,
  setCsvValidationError,
  setCsvTransformError,
  importType,
  isPending,
  isError,
  csvUploadError,
  uploadCSVResponseData,
  csvReadyForImport,
  handleSubmit,
  csvValidationError,
  csvtransformError,
}) => (
  <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
    <div style={{ width: "50%" }}>
      <CSVUploader
        onUpload={handleUpload}
        setCsvValidationError={setCsvValidationError}
        setCsvTransformError={setCsvTransformError}
        importType={importType}
      />
    </div>

    <div style={{ width: "50%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        {isPending && (
          <div style={{ textAlign: "center" }}>
            <Spin tip="Uploading..." />
          </div>
        )}
        {isError && <Alert message={csvUploadError.message} type="error" />}
        {uploadCSVResponseData?.data && (
          <>
            <p>
              <strong>Successful Rows: </strong>
              {/* {responseLogs.success.length} */}
            </p>
            <p>
              <strong>Failed Rows: </strong>
              {/* {responseLogs.errors.length} */}
            </p>
          </>
        )}
        {csvReadyForImport && (
          <>
            <IoIosCheckmarkCircle style={{ color: "green", fontSize: 50 }} />
            <h2>CSV ready for import</h2>
            <Button type="primary" onClick={handleSubmit}>
              Import Data
            </Button>
          </>
        )}
      </div>

      {(csvValidationError.length > 0 || csvtransformError.length > 0) && (
        <Space
          direction="vertical"
          style={{ textAlign: "center", marginTop: 16 }}
        >
          <IoMdWarning style={{ color: "red", fontSize: 50 }} />
          <h2>There's a problem with your csv</h2>
          {csvValidationError.length > 0 && (
            <p>Validation Error: {csvValidationError}</p>
          )}
          {csvtransformError.length > 0 && (
            <p>Transform Error: {csvtransformError}</p>
          )}
        </Space>
      )}
    </div>
  </div>
);

export default CSVUploadSection;
