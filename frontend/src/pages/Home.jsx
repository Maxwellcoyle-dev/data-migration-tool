import React, { useState, useEffect } from "react";
import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosCheckmarkCircle,
  IoMdWarning,
} from "react-icons/io";
import { ThreeDots } from "react-loader-spinner";

import CSVUploader from "../components/CSVUploader.jsx";
import CSVPreview from "../components/CSVPreview.jsx";
import { typeFields } from "../utilities/typeFields.js";

import useProcessResponse from "../hooks/useProcessResponse.js";

import { useResponseLogContext } from "../context/responseLogContext";

import usePostCSV from "../hooks/usePostCSV.js";
import DataImportResults from "../components/ImportLogger.jsx";

const Home = ({ currentPlatformInfo, user }) => {
  const [csvData, setCsvData] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [importType, setImportType] = useState("branches");
  const [importOptions, setImportOptions] = useState({});
  const [csvValidationError, setCsvValidationError] = useState("");
  const [csvtransformError, setCsvTransformError] = useState("");
  const [csvReadyForImport, setCsvReadyForImport] = useState(false);
  const [fieldsVisible, setFieldsVisible] = useState(false);

  const processLogs = useProcessResponse();

  const {
    mutate,
    uploadCSVResponseData,
    csvUploadError,
    isPending,
    isError,
    reset,
  } = usePostCSV();

  useEffect(() => {
    if (
      csvData.length > 0 &&
      (csvValidationError === "" || csvtransformError === "")
    ) {
      setCsvReadyForImport(true);
    } else {
      setCsvReadyForImport(false);
    }
  }, [csvData, csvValidationError, csvtransformError]);

  useEffect(() => {
    const options = {};
    const importTypeConfig = typeFields[importType];
    if (importTypeConfig.options) {
      Object.keys(importTypeConfig.options).forEach((optionKey) => {
        options[optionKey] = importTypeConfig.options[optionKey].defaultValue;
      });
    }
    setImportOptions(options);
  }, [importType]);

  const handleUpload = (previewData, file) => {
    setCsvData(previewData); // Set preview data
    setCsvFile(file); // Set the actual file
    setCsvTransformError("");
    setCsvValidationError("");

    reset();
  };

  useEffect(() => {
    if (uploadCSVResponseData?.data) {
      console.log("uploadCSVResponseData", uploadCSVResponseData);

      processLogs(
        uploadCSVResponseData.data.importType,
        uploadCSVResponseData.data
      );
    }
  }, [uploadCSVResponseData]);

  useEffect(() => {
    console.log("uploadCSVResponseData", uploadCSVResponseData);
    console.log("csvUploadError", csvUploadError);
    console.log("csvUploadError message", csvUploadError?.message);
  }, [uploadCSVResponseData, csvUploadError]);

  const handleSubmit = () => {
    console.log("Submitting data...");
    const formData = new FormData();
    formData.append("file", csvFile); // Append the actual CSV file
    formData.append("options", JSON.stringify(importOptions));
    formData.append("userId", user.userId);
    formData.append("domain", currentPlatformInfo.domain);

    console.log("importTYpe", importType);

    mutate({ formData, importType });

    setCsvData([]);
  };

  const handleOptionChange = (optionKey, value) => {
    setImportOptions((prevOptions) => ({
      ...prevOptions,
      [optionKey]: value,
    }));
  };

  const toggleFieldsVisibility = () => {
    setFieldsVisible(!fieldsVisible);
  };

  const handleImportTypeSelect = (type) => {
    setImportType(type);
    setCsvData([]);
    setCsvTransformError("");
    setCsvValidationError("");
  };

  const renderFields = (fields, title) => (
    <div>
      <h4>{title}</h4>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid lightgray", padding: "8px" }}>
              Field
            </th>
            <th style={{ border: "1px solid lightgray", padding: "8px" }}>
              Type
            </th>
            <th style={{ border: "1px solid lightgray", padding: "8px" }}>
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr
              key={field.field}
              style={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#f2f2f2",
              }}
            >
              <td style={{ border: "1px solid lightgray", padding: "8px" }}>
                {field.field}
              </td>
              <td style={{ border: "1px solid lightgray", padding: "8px" }}>
                {field.type}
              </td>
              <td style={{ border: "1px solid lightgray", padding: "8px" }}>
                {field.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ padding: "0 3rem", paddingBottom: "6rem" }}>
      <div style={{ paddingTop: 40 }}>
        <h2>Docebo - CSV Data Importer</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3>Choose Import Type:</h3>
          <select
            style={{ marginLeft: 10, padding: 5, height: "min-content" }}
            value={importType}
            onChange={(e) => handleImportTypeSelect(e.target.value)}
          >
            {Object.keys(typeFields).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            margin: "2rem 0",
            padding: "1rem",
            border: "1px solid lightgray",
          }}
        >
          <button
            onClick={toggleFieldsVisibility}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            <strong>{importType}</strong> fields
            {fieldsVisible ? (
              <IoIosArrowUp style={{ fontSize: 25 }} />
            ) : (
              <IoIosArrowDown style={{ fontSize: 25 }} />
            )}
          </button>

          {fieldsVisible && (
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                {renderFields(
                  typeFields[importType].requiredFields,
                  "Required Fields"
                )}
              </div>
              <div>
                {renderFields(
                  typeFields[importType].optionalFields,
                  "Optional Fields"
                )}
              </div>
            </div>
          )}
        </div>

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
                <ThreeDots
                  visible={true}
                  height="80"
                  width="80"
                  color="#4fa94d"
                  radius="9"
                  ariaLabel="three-dots-loading"
                />
              )}
              {isError && (
                <p style={{ color: "red" }}>{csvUploadError.message}</p>
              )}
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
                  <IoIosCheckmarkCircle
                    style={{ color: "green", fontSize: 50 }}
                  />
                  <h2>CSV ready for import</h2>
                  <button onClick={handleSubmit} style={styles.button}>
                    Import Data
                  </button>
                </>
              )}
            </div>

            {(csvValidationError.length > 0 ||
              csvtransformError.length > 0) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <IoMdWarning style={{ color: "red", fontSize: 50 }} />
                <h2>There's a problem with your csv</h2>
                {csvValidationError.length > 0 && (
                  <p>Validation Error: {csvValidationError} </p>
                )}
                {csvtransformError.length > 0 && (
                  <p>Transform Error: {csvtransformError} </p>
                )}
              </div>
            )}
          </div>
        </div>

        {csvData.length > 0 && (
          <CSVPreview
            csvData={csvData}
            importType={importType}
            options={typeFields[importType].options}
            importOptions={importOptions}
            handleOptionChange={handleOptionChange}
          />
        )}
      </div>

      {uploadCSVResponseData && (
        <DataImportResults results={uploadCSVResponseData} />
      )}
    </div>
  );
};

const styles = {
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Home;
