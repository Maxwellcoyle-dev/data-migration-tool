import React from "react";
import { Button, Space, Alert, Spin } from "antd";
import CSVUploader from "../components/CSVUploader.jsx";
import { IoIosCheckmarkCircle, IoMdWarning } from "react-icons/io";
import { MdOutlinePending } from "react-icons/md";

const CSVUploadSection = ({
  csvData,
  setImportOptions,
  setCsvData,
  handleUpload,
  setCsvValidationError,
  setCsvTransformError,
  importType,
  csvReadyForImport,
  handleSubmit,
}) => (
  <div
    style={{
      width: "100%",
      minHeight: "11rem",
      display: "flex",
    }}
  >
    {csvData.length === 0 ? (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <CSVUploader
          onUpload={handleUpload}
          setCsvValidationError={setCsvValidationError}
          setCsvTransformError={setCsvTransformError}
          importType={importType}
        />
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          width: "100%",
        }}
      >
        {csvReadyForImport && (
          <>
            <IoIosCheckmarkCircle style={{ color: "green", fontSize: 50 }} />
            <h2 style={{ margin: 0 }}>CSV ready for import</h2>
            <Button type="primary" onClick={handleSubmit}>
              Import Data
            </Button>
            <Button
              type="default"
              onClick={() => {
                setCsvData([]);
                setImportOptions({});
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    )}

    {/* <div
      style={{
        width: "100%",
        height: "10rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {uploadCSVResponseData?.status && (
        <Space
          direction="vertical"
          style={{ textAlign: "center", marginTop: 16 }}
        >
          <MdOutlinePending style={{ color: "green", fontSize: 50 }} />
          <h2>Upload Status</h2>
          <p>
            <strong>Status: </strong>
            {uploadCSVResponseData.status}
          </p>
        </Space>
      )}
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
    </div> */}
  </div>
);

export default CSVUploadSection;
