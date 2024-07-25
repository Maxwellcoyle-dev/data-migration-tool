import React, { useEffect, useState } from "react";
import { Button, Space, Alert, Spin } from "antd";
import { IoIosCheckmarkCircle, IoMdWarning } from "react-icons/io";
import { MdOutlinePending } from "react-icons/md";

// Components
import CSVDropbox from "./CSVDropbox.jsx";
import CSVUploader from "./CSVUploader.jsx";

const CSVUploadSection = ({
  csvData,
  setImportOptions,
  setCsvData,
  handleUpload,
  setCsvValidationError,
  csvValidationError,
  setCsvTransformError,
  importType,
  csvReadyForImport,
  handleSubmit,
  isPending,
  isError,
  csvUploadError,
  uploadCSVResponseData,
}) => {
  const [view, setView] = useState("dropbox");

  useEffect(() => {
    console.log("csvReadyForImport", csvReadyForImport);
    console.log("csvData", csvData);
    if (csvReadyForImport) {
      setView("uploader");
    }
  }, [csvReadyForImport]);

  const handleResetDropbox = () => {
    setCsvData([]);
    setImportOptions({});
    setCsvValidationError("");
    setCsvTransformError("");
    setView("dropbox");
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "11rem",
        display: "flex",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2>Upload CSV</h2>
        {view === "dropbox" ? (
          <CSVDropbox
            onUpload={handleUpload}
            setCsvValidationError={setCsvValidationError}
            csvValidationError={csvValidationError}
            setCsvTransformError={setCsvTransformError}
            importType={importType}
            handleResetDropbox={handleResetDropbox}
          />
        ) : (
          <CSVUploader
            csvReadyForImport={csvReadyForImport}
            handleSubmit={handleSubmit}
            setCsvData={setCsvData}
            setImportOptions={setImportOptions}
            setView={setView}
            isPending={isPending}
            isError={isError}
            csvUploadError={csvUploadError}
            uploadCSVResponseData={uploadCSVResponseData}
          />
        )}
      </div>
    </div>
  );
};

export default CSVUploadSection;
