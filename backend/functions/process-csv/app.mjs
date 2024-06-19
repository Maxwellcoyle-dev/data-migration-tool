import axios from "axios";

import { processMultipartForm, csvToJson } from "./utils/multipartUtils.mjs";
import { transformData } from "./utils/transformData.mjs";
import { typeFields } from "./utils/typeFields.mjs";
import { getAccessToken } from "./utils/getAccessToken.mjs";

const postToDocebo = async (url, headers, data) => {
  try {
    const response = await axios.post(url, data, { headers });
    console.log("Docebo API response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Docebo API error: ${error.response.status} ${error.response.data}`
      );
    } else {
      throw new Error(`Docebo API request error: ${error.message}`);
    }
  }
};

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    const { fileData, optionsData, importType, userId, domain } =
      await processMultipartForm(event);

    // Process the CSV data
    const jsonData = await csvToJson(fileData);
    const transformedData = transformData(jsonData, importType);

    // Get access token
    const accessToken = await getAccessToken(userId, domain);

    // Prepare API request
    const endpoint = typeFields[importType].endpoint;
    const url = `https://${domain}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const body = { items: transformedData, options: optionsData };

    // Send data to Docebo API
    const response = await postToDocebo(url, headers, body);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "File processed successfully",
        data: response.data,
        version: response.version,
        _links: response._links,
      }),
    };
  } catch (error) {
    console.error("Handler error:", error.message);

    // Error response
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Handler error",
        error: error.message,
      }),
    };
  }
};
