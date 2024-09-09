import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

import handlePendingImports from "./utilities/handlePendingImports.mjs";

const client = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  // handle cors options
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    };
  }
  console.log("event", event);

  const userId = event.queryStringParameters.userId;
  console.log("userId", userId);
  // scan table for gsi items matching userId
  const params = {
    TableName: process.env.MIGRATION_IMPORT_TABLE,
    IndexName: "userId-index",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };

  try {
    const command = new QueryCommand(params);
    const data = await client.send(command);
    console.log("data", data);

    let returnData = [];

    for (const item of data.Items) {
      console.log("item", item);
      // handle items with importStatus of "pending" need to check if all of the chunks have been processed
      let newImportStatus = item.importStatus.S;
      let newStatusMessage = item.statusMessage.S;
      console.log("item.importStatus.S", item.importStatus.S);
      console.log("item.statusMessage.S", item.statusMessage.S);

      if (item.importStatus.S === "pending") {
        const { status, message } = await handlePendingImports(item);
        newImportStatus = status;
        newStatusMessage = message;
      }

      returnData.push({
        ...(item.importId?.S && { importId: item.importId.S }),
        ...(item.userId?.S && { userId: item.userId.S }),
        ...(item.importType?.S && { importType: item.importType.S }),
        ...(item.importStatus?.S && { importStatus: newImportStatus }),
        ...(item.chunkCount?.N && { chunkCount: item.chunkCount.N }),
        ...(item.statusMessage?.S && { statusMessage: newStatusMessage }),
        ...(item.importDate?.S && { importDate: item.importDate.S }),
        ...(item.domain?.S && { domain: item.domain.S }),
        ...(item.fileName?.S && { fileName: item.fileName.S }),
      });
    }

    console.log("returnData", returnData);

    // sort items based on the most recent importDate timeStamp
    returnData.sort((a, b) => {
      return new Date(b.importDate) - new Date(a.importDate);
    });

    console.log("returnData", returnData);

    // handle cors headers in the response
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(returnData),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
