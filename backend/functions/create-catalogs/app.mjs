import { processMultipartForm, csvToJson } from "./utils/multipartUtils.mjs";
import { transformCatalogs } from "./utils/transformCatalogs.mjs";
import { catalogTypeFields } from "./utils/catalogTypeFields.mjs";
import { getAccessToken } from "./utils/getAccessToken.mjs";

// Function to post data to Docebo
import { createCatalogs } from "./createCatalogs.mjs";

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    const { fileData, optionsData, userId, domain } =
      await processMultipartForm(event);
    console.log("Received data:", fileData, optionsData, userId, domain);

    const jsonData = await csvToJson(fileData);
    const transformedData = transformCatalogs(jsonData);
    const accessToken = await getAccessToken(userId, domain);

    const endpoint = catalogTypeFields.endpoint;
    const url = `https://${domain}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const body = { items: transformedData, options: optionsData };

    const apiResponse = await createCatalogs(url, headers, body);

    console.log("API response:", apiResponse);

    return {
      statusCode: 200,
      body: JSON.stringify(apiResponse),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }
};
