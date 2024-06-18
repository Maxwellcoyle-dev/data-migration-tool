import { processMultipartForm, csvToJson } from "./utils/multipartUtils.mjs";
import { transformData } from "./utils/transformData.mjs";

export const handler = async (event) => {
  console.log("Received event, yo:", JSON.stringify(event));

  try {
    const { fileData, optionsData, importType } = await processMultipartForm(
      event
    );

    // Process the CSV data
    try {
      const jsonData = await csvToJson(fileData); // Parse CSV to JSON
      console.log(
        "CSV to JSON conversion successful:",
        JSON.stringify(jsonData, null, 2)
      ); // Ensure JSON format
      const transformedData = transformData(jsonData, importType); // Transform JSON data based on importType
      console.log(
        "Transformed data:",
        JSON.stringify(transformedData, null, 2)
      ); // Ensure JSON format

      // Success response
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "File processed successfully",
          data: transformedData,
          options: optionsData,
          importType: importType,
        }),
      };
    } catch (error) {
      console.error("CSV to JSON conversion failed:", error);

      // Error response
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "CSV to JSON conversion failed",
          error: error.message,
          importType: importType,
        }),
      };
    }
  } catch (error) {
    console.error("Handler error:", error);

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
