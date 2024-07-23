import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetLog = (logId) => {
  const {
    data: logData,
    isLoading: logIsLoading,
    isError: logIsError,
    refetch: refetchLog,
  } = useQuery({
    queryKey: ["log", logId],
    queryFn: async () => {
      const response = await axios.get(
        `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/get-log`,
        {
          params: {
            id: logId,
          },
        }
      );
      return response.data;
    },
    enabled: !!logId,
  });

  return { logData, logIsLoading, logIsError, refetchLog };
};

export default useGetLog;
