import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetImport = (importId) => {
  const {
    data: importData,
    isLoading: importIsLoading,
    isError: importIsError,
    refetch: refetchImport,
  } = useQuery({
    queryKey: ["log", importId],
    queryFn: async () => {
      const response = await axios.get(
        `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/get-import`,
        {
          params: {
            id: importId,
          },
        }
      );
      return response.data;
    },
    enabled: !!importId,
  });

  return { importData, importIsLoading, importIsError, refetchImport };
};

export default useGetImport;
