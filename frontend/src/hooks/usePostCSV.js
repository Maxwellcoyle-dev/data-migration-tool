import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import {
  createBranches,
  createCourses,
  createGroups,
} from "../api/lambdaEndpoints";

const usePostCSV = () => {
  const importTypeMap = {
    branches: createBranches,
    courses: createCourses,
    groups: createGroups,
  };

  const {
    mutate,
    data: uploadCSVResponseData,
    error: csvUploadError,
    isPending,
    isError,
    reset,
  } = useMutation({
    mutationFn: async ({ formData, importType }) => {
      try {
        const apiFunction = importTypeMap[importType];
        if (!apiFunction) {
          throw new Error("Invalid import type");
        }
        const response = await apiFunction(formData);
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
