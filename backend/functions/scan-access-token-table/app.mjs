import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
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

  const userId = event.queryStringParameters.userId;
  // scan table for items matching userId
  const params = {
    TableName: "AccessTokens",
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  };

  try {
    const command = new ScanCommand(params);
    const data = await client.send(command);
    console.log("data", data);

    //

    let returnData = data.Items.map((item) => {
      return {
        clientId: item.clientId.S,
        platformUrl: item.platformUrl.S,
        clientSecret: item.clientSecret.S,
        userId: item.userId.S,
        timeStamp: item.timeStamp.S,
      };
    });

    // sort items based on the most recent timeStamp
    returnData.sort((a, b) => {
      return a.timeStamp < b.timeStamp ? 1 : -1;
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
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
