import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });

export const getAccessToken = async (userId, domain) => {
  try {
    console.log("userId", userId);
    console.log("domain", domain);
    const params = {
      TableName: process.env.ACCESS_TOKEN_TABLE_NAME,
      Key: {
        userId: { S: userId },
        platformUrl: { S: domain },
      },
    };

    const { Item } = await client.send(new GetItemCommand(params));

    if (!Item || !Item.accessToken) {
      throw new Error("AccessToken not found");
    }
  } catch (error) {
    console.error("Error getting access token", error);
    throw error;
  }

  return Item.accessToken.S;
};
