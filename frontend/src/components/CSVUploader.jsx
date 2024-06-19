import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { validateData } from "../utilities/validations";
import { transformData } from "../utilities/tranformations";

const CSVUploader = ({
  onUpload,
  setUploadError,
  importType,
  requiredFields,
}) => {
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
          const validationErrors = validateData(
            [allHeaders],
            importType,
            requiredFields
          );
          if (validationErrors.length > 0) {
            setUploadError(validationErrors.join("; "));
          } else {
            try {
              // Transform only the first 3 rows for preview
              const transformedPreviewData = transformData(
                previewData,
                importType
              );
              // Set the preview data and pass the file for later use
              onUpload(transformedPreviewData, file);
              setUploadError("");
            } catch (error) {
              setUploadError(error.message);
            }
          }
        },
        header: true,
      });
    },
    [onUpload, importType, requiredFields, setUploadError]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div>
      <div {...getRootProps()} className="dropzone" style={styles.dropzone}>
        <input {...getInputProps()} />
        <p>Drag and drop a CSV file here, or</p>
        <button type="button" onClick={open} style={styles.button}>
          Browse Files
        </button>
      </div>
    </div>
  );
};

const styles = {
  dropzone: {
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

export default CSVUploader;
