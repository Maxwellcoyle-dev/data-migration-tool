import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useDeleteImport = (userId) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteImportAsync,
    isPending: deleteImportIsPending,
    isSuccess: deleteImportIsSuccess,
    isIdle: deleteImportIsIdle,
    isError: deleteImportIsError,
  } = useMutation({
    mutationFn: async (importId) => {
      console.log("Deleting import -- ", importId);
      console.log("User ID -- ", userId);

      if (!importId || !userId) {
        throw new Error("Import ID and User ID are required");
      }
      const response = await axios.post(
        `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/delete-import?userId=${userId}&importId=${importId}`
      );
      console.log("Response -- ", response);
      return response.data;
    },
    onError: (error) => {
      console.error("Error in deleting import:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["log-list", userId] });
    },
  });

  return {
    deleteImportAsync,
    deleteImportIsPending,
    deleteImportIsSuccess,
    deleteImportIsIdle,
    deleteImportIsError,
  };
};

export default useDeleteImport;
