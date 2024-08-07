import React from "react";
import CSVPreview from "../components/CSVPreview.jsx";

const CSVPreviewSection = ({
  csvData,
  importType,
  typeFields,
  importOptions,
  handleOptionChange,
}) => (
  <div>
    <CSVPreview
      csvData={csvData}
      importType={importType}
      options={typeFields.options}
      importOptions={importOptions}
      handleOptionChange={handleOptionChange}
    />
  </div>
);

export default CSVPreviewSection;
