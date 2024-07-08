import { useResponseLogContext } from "../context/responseLogContext";

const useProcessResponse = async () => {
  const { setResponseLogs } = useResponseLogContext();
  let successLogs;
  let errorLogs;

  const processLogs = (importType, response) => {
    console.log("importType", importType);
    console.log("response", response);

    switch (importType) {
      case "groups":
        console.log("response", response);
        successLogs = response.map((log) => {
          console.log("log", log);
          return {
            group_name: log.group_name,
            group_uuid: log.group_uuid,
          };
        });
        console.log("successLogs", successLogs);
        setResponseLogs({
          success: successLogs,
          errors: [],
          showLogs: true,
        });

        break;
      default:
        console.log("response", response);
        successLogs = response.data.data.data.filter((log) => log.success);
        console.log("successLogs", successLogs);
        errorLogs = response.data.data.data.filter((log) => !log.success);
        console.log("errorLogs", errorLogs);

        setResponseLogs({
          success: successLogs,
          errors: errorLogs,
          showLogs: true,
        });
    }
  };
  return processLogs;
};

export default useProcessResponse;
