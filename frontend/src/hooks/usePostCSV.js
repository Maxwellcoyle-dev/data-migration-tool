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

        if (error.response && error.response.data) {
          const errorMessage = `${error.response.data.data.error.name} -- ${error.response.data.data.error.message[0]}`;
          console.log("Error message:", errorMessage);

          throw new Error(errorMessage);
        }
        throw new Error(error.message || "Network or unknown error");
      }
    },
    onError: (error) => {
      console.error("Error in processing CSV:", error);
    },
  });

  return {
    mutate,
    uploadCSVResponseData,
    csvUploadError,
    isPending,
    isError,
    reset,
  };
};

export default usePostCSV;
