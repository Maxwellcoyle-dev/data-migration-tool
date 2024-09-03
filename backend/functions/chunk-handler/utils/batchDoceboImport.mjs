import axios from "axios";

import importTypes from "./importTypes.mjs";

import { formatEnrollmentsDates } from "./formatEnrollmentDates.mjs";

const batchDoceboImport = async (
  domain,
  importType,
  accessToken,
  data,
  importOptions
) => {
  let importData;

  if (importType === "enrollments") {
    importData = formatEnrollmentsDates(data);
  } else {
    importData = data;
  }

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
      items: importData,
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
    const successResponse = {
      success: true,
      statusMessage: "Docebo data import completed",
      data: mappedResponse,
    };
    return successResponse;
  } catch (error) {
    console.error("Docebo API error:", error);
    // Check if the error has response data
    if (error.response) {
      const errorResponse = {
        success: false,
        statusMessage: `${error.response.data.status} - ${error.response.data.name} - ${error.response.data.message}`,
      };
      console.log("Error response:", errorResponse);
      return errorResponse;
    } else {
      return { success: false, message: error.message };
    }
  }
};

export default batchDoceboImport;
