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
    data: importsList,
    isLoading: importsListIsLoading,
    isError: importsListIsError,
    refetch: refetchImportsList,
  } = useQuery({
    queryKey: ["log-list", user?.userId],
    queryFn: async () => {
      const response = await axios.get(
        `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/list-imports?userId=${user.userId}`
      );
      return response.data;
    },
    enabled: !!user?.userId,
  });

  return {
    importsList,
    importsListIsLoading,
    importsListIsError,
    refetchImportsList,
  };
};

export default useListImportLogs;
