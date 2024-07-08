import { processMultipartForm, csvToJson } from "./utils/multipartUtils.mjs";
import { transformCourses } from "./utils/transformCourses.mjs";
import { courseTypeFields } from "./utils/courseTypeFields.mjs";
import { getAccessToken } from "./utils/getAccessToken.mjs";

// Function to post data to Docebo
import { createCourses } from "./createCourses.mjs";

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    const { fileData, optionsData, userId, domain } =
      await processMultipartForm(event);
    console.log("Received data:", fileData, optionsData, userId, domain);

    const jsonData = await csvToJson(fileData);
    const transformedData = transformCourses(jsonData);
    const accessToken = await getAccessToken(userId, domain);

    const endpoint = courseTypeFields.endpoint;
    const url = `https://${domain}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const body = { items: transformedData, options: optionsData };

    const apiResponse = await createCourses(url, headers, body);

    console.log("API response:", apiResponse);

    return {
      statusCode: 200,
      body: JSON.stringify(apiResponse),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Add CORS header here
      },
    };
  }
};
