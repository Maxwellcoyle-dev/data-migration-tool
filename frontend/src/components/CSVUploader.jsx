import React from "react";
import { Button, Spin, Result } from "antd";
import { IoIosCheckmarkCircle, IoMdWarning } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CSVUploader = ({
  csvReadyForImport,
  handleSubmit,
  setCsvData,
  setImportOptions,
  setView,
  isPending,
  isError,
  csvUploadError,
  uploadCSVResponseData,
}) => {
  const navigate = useNavigate();

  return (
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
              setView("dropbox");
            }}
          >
            Cancel
          </Button>
        </>
      )}
      {isPending && (
        <>
          <h2 style={{ margin: 0 }}>Importing Data</h2>
          <Spin size="large" />
        </>
      )}
      {isError && (
        <>
          <Result status="error" title={csvUploadError?.statusMessage} />
          <Button
            type="default"
            onClick={() => {
              setCsvData([]);
              setImportOptions({});
              setView("dropbox");
            }}
          >
            Close
          </Button>
        </>
      )}
      {uploadCSVResponseData && (
        <>
          <Result
            status="success"
            title={uploadCSVResponseData.statusMessage}
            style={{ padding: 0 }}
          />
          <Button
            type="default"
            onClick={() => {
              setCsvData([]);
              setImportOptions({});
              navigate(`/log/${uploadCSVResponseData.importId}`);
            }}
          >
            View Log
          </Button>
          <Button
            type="default"
            onClick={() => {
              setCsvData([]);
              setImportOptions({});
              setView("dropbox");
            }}
          >
            Close
          </Button>
        </>
      )}
    </div>
  );
};

export default CSVUploader;
