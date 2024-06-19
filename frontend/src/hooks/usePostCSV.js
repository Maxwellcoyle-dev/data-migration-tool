import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const usePostCSV = () => {
  const {
    mutate,
    data: uploadCSVResponseData,
    error: csvUploadError,
    isPending,
    isError,
    reset,
  } = useMutation({
    mutationFn: async (formData) => {
      return await axios.post(
        `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/process-csv`,
        formData
      );
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
