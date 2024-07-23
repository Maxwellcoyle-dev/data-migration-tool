import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";

const useListImportLogs = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
        console.log(user);
      })
      .catch((error) => console.error(error));
  }, []);

  const {
    data: logsList,
    isLoading: logsListIsLoading,
    isError: logsListIsError,
    refetch: refetchLogsList,
  } = useQuery({
    queryKey: ["log-list", user?.userId],
    queryFn: async () => {
      const response = await axios.get(
        `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/list-logs?userId=${user.userId}`
      );
      return response.data;
    },
    enabled: !!user?.userId,
  });

  return { logsList, logsListIsLoading, logsListIsError, refetchLogsList };
};

export default useListImportLogs;
