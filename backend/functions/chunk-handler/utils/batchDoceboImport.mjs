import axios from "axios";

import importTypes from "./importTypes.mjs";

const batchDoceboImport = async (
  domain,
  importType,
  accessToken,
  data,
  importOptions
) => {
  // send data to Docebo
  const endpoint = importTypes[importType].endpoint;
  console.log("Endpoint:", endpoint);
  const url = `https://${domain}${endpoint}`;
  console.log("URL:", url);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    console.log("Docebo API request:", url, data);
    const requestData = {
      items: data,
      options: importOptions,
    };
    const response = await axios.post(url, requestData, { headers });

    console.log("Docebo API response:", response);
    console.log("Docebo API response.data:", response.data);

    // Create a map of code to catalog items
    const mappedResponse = importTypes[importType].responseMapFunction(
      response.data,
      data
    );
    console.log("Mapped response:", mappedResponse);
    return mappedResponse;
  } catch (error) {
    console.error("Docebo API error:", error);
    // Check if the error has response data
    if (error.response) {
      const errorResponse = {
        success: false,
        data: error.response.data,
        status: error.response.status,
      };
      console.log("Error response:", errorResponse);
      return errorResponse;
    } else {
      return { success: false, message: error.message };
    }
  }
};

export default batchDoceboImport;
