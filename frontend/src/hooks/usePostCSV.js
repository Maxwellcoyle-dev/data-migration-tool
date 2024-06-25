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
      try {
        const response = await axios.post(
          `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/process-csv`,
          formData
        );
        console.log("response:", response.data);
        return response.data;
      } catch (error) {
        console.log("Full Axios Error:", error.response);

        if (error.response.data) {
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
