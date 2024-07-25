import React, { useCallback, useEffect } from "react";
import { Alert, Button } from "antd";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

// Utilities
import { validateData } from "../utilities/validations";
import { transformData } from "../utilities/tranformations";

const CSVDropbox = ({
  onUpload,
  setCsvValidationError,
  csvValidationError,
  setCsvTransformError,
  importType,
  handleResetDropbox,
}) => {
  useEffect(() => {
    console.log("csvValidationError", csvValidationError);
  }, [csvValidationError]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      let rowCount = 0;
      let previewData = [];
      let allHeaders = null;

      Papa.parse(file, {
        step: (results, parser) => {
          if (rowCount === 0) {
            // Store the headers
            allHeaders = results.meta.fields;
          }
          if (rowCount < 3) {
            previewData.push(results.data);
          }
          rowCount++;
          if (rowCount === 3) {
            parser.abort(); // abort parsing after the first 3 rows
          }
        },
        complete: () => {
          // Validate the data using headers only
          const validationErrors = validateData([allHeaders], importType);
          if (validationErrors.length > 0) {
            setCsvValidationError(validationErrors.join("; "));
          } else {
            try {
              // Transform only the first 3 rows for preview
              const transformedPreviewData = transformData(
                previewData,
                importType
              );
              // Set the preview data and pass the file for later use
              onUpload(transformedPreviewData, file);
            } catch (error) {
              setCsvTransformError("Error transforming CSV data");
            }
          }
        },
        header: true,
      });
    },
    [onUpload, importType, setCsvValidationError, setCsvTransformError]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    noClick: true,
    noKeyboard: true,
  });

  return csvValidationError.length > 0 ? (
    <div style={{ marginBottom: "1rem" }}>
      <Alert
        message="Error"
        description={csvValidationError}
        type="error"
        showIcon
        action={<Button onClick={handleResetDropbox}>clear</Button>}
      />
    </div>
  ) : (
    <div {...getRootProps()} className="dropzone" style={styles.dropzone}>
      <input {...getInputProps()} />
      <p>Drag and drop a CSV file here, or</p>
      <button type="button" onClick={open} style={styles.button}>
        Browse Files
      </button>
    </div>
  );
};

const styles = {
  dropzone: {
    width: "100%",
    border: "2px dashed #cccccc",
    borderRadius: "5px",
    padding: "20px",
    textAlign: "center",
  },
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

export default CSVDropbox;
