import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const useGetPlatforms = ({ userId }) => {
  const fetchPlatforms = async () => {
    return await axios.get(
      `https://jg2x5ta8g1.execute-api.us-east-2.amazonaws.com/Stage/scan-table`,
      {
        params: {
          userId,
        },
      }
    );
  };

  const {
    data,
    error: platformsError,
    isLoading: platformIsLoading,
  } = useQuery({
    queryKey: ["platforms"],
    queryFn: fetchPlatforms,
  });

  return {
    platforms: data?.data,
    platformIsLoading,
    platformsError,
  };
};

export default useGetPlatforms;
