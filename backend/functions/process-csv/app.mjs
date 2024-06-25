import axios from "axios";

import { processMultipartForm, csvToJson } from "./utils/multipartUtils.mjs";
import { transformData } from "./utils/transformData.mjs";
import { typeFields } from "./utils/typeFields.mjs";
import { getAccessToken } from "./utils/getAccessToken.mjs";

const postToDocebo = async (url, headers, data) => {
  try {
    console.log("Docebo API request:", url, data);
    const response = await axios.post(url, data, { headers });
    console.log("Docebo API response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Docebo API error:", error);
    // Check if the error has response data
    if (error.response) {
      return {
        success: false,
        data: error.response.data,
        status: error.response.status,
      };
    } else {
      return { success: false, message: error.message };
    }
  }
};

const createResponse = (statusCode, message, data = {}) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message,
      data,
    }),
  };
};

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    const { fileData, optionsData, importType, userId, domain } =
      await processMultipartForm(event);
    const jsonData = await csvToJson(fileData);
    const transformedData = transformData(jsonData, importType);
    const accessToken = await getAccessToken(userId, domain);

    const endpoint = typeFields[importType].endpoint;
    const url = `https://${domain}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const body = { items: transformedData, options: optionsData };

    const apiResponse = await postToDocebo(url, headers, body);
    if (!apiResponse.success) {
      console.error("API error:", apiResponse);
      return createResponse(
        apiResponse.status || 500,
        "Error processing request",
        {
          error: apiResponse.data || apiResponse.message,
        }
      );
    }

    return createResponse(200, "File processed successfully", {
      data: apiResponse.data,
    });
  } catch (error) {
    console.error("Handler error:", error);
    return createResponse(500, "Internal server error", {
      error: error.message,
    });
  }
};
