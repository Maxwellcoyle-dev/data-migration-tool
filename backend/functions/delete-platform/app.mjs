import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  // handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "DELETE,OPTIONS",
      },
      body: JSON.stringify({ statusMessage: "Preflight OK" }),
    };
  }

  console.log("event", event);

  const { userId, domain } = event.queryStringParameters;

  if (!userId || !domain) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "DELETE,OPTIONS",
      },
      body: JSON.stringify({ statusMessage: "Missing parameters" }),
    };
  }

  const deleteImportParams = {
    TableName: process.env.ACCESS_TOKEN_TABLE_NAME,
    Key: {
      userId: { S: userId },
      platformUrl: { S: domain },
    },
  };

  try {
    const deleteImport = new DeleteItemCommand(deleteImportParams);
    const deleteResponse = await dynamoClient.send(deleteImport);
    console.log("deleteResponse", deleteResponse);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "DELETE,OPTIONS",
      },
      body: JSON.stringify({ statusMessage: "Platform deleted" }),
    };
  } catch (error) {
    console.error("Error", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "DELETE,OPTIONS",
      },
      body: JSON.stringify({ statusMessage: "Error deleting platform" }),
    };
  }
};
