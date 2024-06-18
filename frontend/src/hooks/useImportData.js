import axios from "axios";

const useImportData = (accessToken, httpMethod, endpoint, domain) => {
  const importData = async (payload) => {
    console.log(domain, endpoint, httpMethod, payload);
    console.log(payload);

    try {
      const url = `https://${domain}${endpoint}`;
      console.log(`Making request to URL: ${url}`);
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      console.log("headers", headers);
      console.log("body", payload); // changed 'body' to 'payload' in the log for clarity

      const response = await axios({
        method: httpMethod,
        url: url, // simplified to just `url`
        headers: headers,
        data: payload, // changed from 'body' to 'data'
      });
      console.log("response", response);
    } catch (error) {
      console.error("error", error);
    }
  };

  return importData;
};

export default useImportData;
