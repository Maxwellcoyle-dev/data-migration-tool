import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  createBranches,
  createCourses,
  createGroups,
  createCatalogs,
  createEnrollments,
} from "../api/lambdaEndpoints";

const usePostCSV = () => {
  const importTypeMap = {
    branches: createBranches,
    courses: createCourses,
    groups: createGroups,
    catalogs: createCatalogs,
    enrollments: createEnrollments,
  };

  const {
    mutate,
    data: uploadCSVResponseData,
    error: csvUploadError,
    isPending,
    isError,
    reset,
  } = useMutation({
    mutationFn: async ({ formData }) => {
      try {
        console.log("formData", formData);
        const response = await axios.post(
          "https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/post-csv",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.log("Full Axios Error:", error);
        const errorPayload = error.response.data.importErrorPayload;
        const errorMessage = `${errorPayload.importStatus}: ${errorPayload.statusMessage}`;
        throw new Error(JSON.stringify(errorPayload)); // Convert to JSON string to handle the error as an object
      }
    },
    onError: (error) => {
      console.log("Error in processing CSV:", error);
    },
  });

  return {
    mutate,
    uploadCSVResponseData,
    csvUploadError: csvUploadError ? JSON.parse(csvUploadError.message) : null, // Parse the error message back to an object
    isPending,
    isError,
    reset,
  };
};

export default usePostCSV;
