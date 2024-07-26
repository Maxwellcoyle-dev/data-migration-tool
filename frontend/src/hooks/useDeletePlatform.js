import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";

const useDeletePlatform = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
        console.log("user", user);
      })
      .catch((error) => console.error(error));
  }, []);

  const queryClient = useQueryClient();

  const {
    mutate: deletePlatformMutation,
    data: deletePlatformData,
    isSuccess: deletePlatformIsSuccess,
    isLoading: deletePlatformIsLoading,
    isError: deletePlatformIsError,
  } = useMutation({
    mutationFn: async ({ platformDomain }) => {
      try {
        console.log("platformDomain", platformDomain);
        const response = await axios.post(
          `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/delete-platform?userId=${user.userId}&domain=${platformDomain}`
        );
        console.log("response", response);
        return response.data;
      } catch (error) {
        console.error("Error in deleting platform:", error);
        throw new Error(error.message || "Network or unknown error");
      }
    },
    onError: (error) => {
      console.error("Error in deleting platform:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("platforms");
    },
  });

  return {
    deletePlatformMutation,
    deletePlatformData,
    deletePlatformIsSuccess,
    deletePlatformIsLoading,
    deletePlatformIsError,
  };
};

export default useDeletePlatform;
