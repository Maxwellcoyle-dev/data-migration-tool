import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
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

    let returnData = data.Items.map((item) => {
      console.log("item", item);
      return {
        importId: item.importId.S,
        userId: item.userId.S,
        importType: item.importType.S,
        importStatus: item.importStatus.S,
        statusMessage: item.statusMessage.S,
        importDate: item.importDate.S,
        domain: item.domain.S,
      };
    });
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
