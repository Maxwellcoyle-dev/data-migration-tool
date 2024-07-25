import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import FieldRenderer from "../components/FieldRenderer";
import CSVUploadSection from "../components/CSVUploadSection";
import CSVPreviewSection from "../components/CSVPreviewSection";
import LogListPreview from "../components/LogListPreview/LogListPreview.jsx";
import useProcessResponse from "../hooks/useProcessResponse.js";
import usePostCSV from "../hooks/usePostCSV.js";

import types from "../utilities/types.js";

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

  const typeFields = types(importType);

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
    const importTypeConfig = types(importType);
    if (importTypeConfig.options) {
      Object.keys(importTypeConfig.options).forEach((optionKey) => {
        options[optionKey] = importTypeConfig.options[optionKey].defaultValue;
      });
    }
    setImportOptions(options);
  }, [importType]);

  const handleUpload = (previewData, file) => {
    setCsvData(previewData);
    setCsvFile(file);
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

  // remove any options with null, undefined, empty strings values, or empty arrays
  const cleanOptions = (options) => {
    const cleanedOptions = {};
    Object.keys(options).forEach((optionKey) => {
      const optionValue = options[optionKey];
      if (
        optionValue !== null &&
        optionValue !== undefined &&
        optionValue !== "" &&
        !(Array.isArray(optionValue) && optionValue.length === 0)
      ) {
        cleanedOptions[optionKey] = optionValue;
      }
    });
    return cleanedOptions;
  };

  const handleSubmit = () => {
    const cleanedOptions = cleanOptions(importOptions);

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("options", JSON.stringify(cleanedOptions));
    formData.append("userId", user.userId);
    formData.append("domain", currentPlatformInfo.domain);
    formData.append("importType", importType);

    mutate({ formData });

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

  return (
    <div
      style={{
        padding: "0 3rem",
        paddingBottom: "6rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <Header
        importType={importType}
        handleImportTypeSelect={handleImportTypeSelect}
        typeFields={typeFields}
      />
      <FieldRenderer
        importType={importType}
        fieldsVisible={fieldsVisible}
        toggleFieldsVisibility={toggleFieldsVisibility}
        typeFields={typeFields}
      />
      <CSVUploadSection
        csvData={csvData}
        setImportOptions={setImportOptions}
        setCsvData={setCsvData}
        handleUpload={handleUpload}
        setCsvValidationError={setCsvValidationError}
        setCsvTransformError={setCsvTransformError}
        importType={importType}
        isPending={isPending}
        isError={isError}
        csvUploadError={csvUploadError}
        uploadCSVResponseData={uploadCSVResponseData}
        csvReadyForImport={csvReadyForImport}
        handleSubmit={handleSubmit}
        csvValidationError={csvValidationError}
        csvtransformError={csvtransformError}
      />
      {csvData.length > 0 && (
        <CSVPreviewSection
          csvData={csvData}
          importType={importType}
          typeFields={typeFields}
          importOptions={importOptions}
          handleOptionChange={handleOptionChange}
        />
      )}
      <LogListPreview />
    </div>
  );
};

export default Home;
