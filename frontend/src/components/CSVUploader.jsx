import React from "react";
import { Button } from "antd";
import { IoIosCheckmarkCircle, IoMdWarning } from "react-icons/io";

const CSVUploader = ({
  csvReadyForImport,
  handleSubmit,
  setCsvData,
  setImportOptions,
  setView,
}) => {
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
    </div>
  );
};

export default CSVUploader;
