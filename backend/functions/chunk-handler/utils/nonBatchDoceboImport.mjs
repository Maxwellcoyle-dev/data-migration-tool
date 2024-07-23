import axios from "axios";

import importTypes from "./importTypes.mjs";

const nonBatchDoceboImport = async (
  domain,
  importType,
  accessToken,
  data,
  importOptions
) => {
  console.log("Create groups initiated");
  let responseData = [];

  const endpoint = importTypes[importType].endpoint;
  console.log("Endpoint:", endpoint);
  const url = `https://${domain}${endpoint}`;
  console.log("URL:", url);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  for (let i = 0; i < data.length; i++) {
    try {
      console.log("Docebo API request:", url, data[i]);
      const response = await axios.post(url, data[i], { headers });
      console.log("Docebo API response:", response.data);
      const groupResponse = {
        group_name: data[i].name,
        group_uuid: response.data.data.uuid,
        success: true,
      };
      responseData.push(groupResponse);
    } catch (error) {
      console.error("Docebo API error:", error);
      const errorResponse = {
        group_name: data[i].name,
        success: false,
        ...(error.response && {
          response_status: error.response.status,
          error_code: error.response.data.code,
          error_message: error.response.data.message[0],
        }),
      };
      console.log("Error response:", errorResponse);
      responseData.push(errorResponse);
    }
  }

  console.log("Docebo API responses:", responseData);
  return responseData;
};

export default nonBatchDoceboImport;
