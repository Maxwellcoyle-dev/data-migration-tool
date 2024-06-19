import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import axios from "axios";

import { processMultipartForm, csvToJson } from "./utils/multipartUtils.mjs";
import { transformData } from "./utils/transformData.mjs";

const client = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  console.log("Received event, yo:", JSON.stringify(event));

  try {
    const { fileData, optionsData, importType, userId, domain } =
      await processMultipartForm(event);

    // Process the CSV data

    const jsonData = await csvToJson(fileData); // Parse CSV to JSON
    console.log(
      "CSV to JSON conversion successful:",
      JSON.stringify(jsonData, null, 2)
    ); // Ensure JSON format
    const transformedData = transformData(jsonData, importType); // Transform JSON data based on importType
    console.log("Transformed data:", JSON.stringify(transformedData, null, 2));

    // get the platform item from dynamodb table using partition key hash - userId + sort key platformUrl
    const params = {
      TableName: "AccessTokens",
      Key: {
        userId: { S: userId },
        platformUrl: { S: domain },
      },
    };

    const { Item } = await client.send(new GetItemCommand(params));
    console.log("Item:", Item);

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
