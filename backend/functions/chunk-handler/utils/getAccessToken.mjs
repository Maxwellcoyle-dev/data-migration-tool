import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });

export const getAccessToken = async (userId, domain) => {
  console.log("get access topken function initiated");
  try {
    console.log("get access token - userId", userId);
    console.log("get access token - domain", domain);
    const params = {
      TableName: process.env.ACCESS_TOKEN_TABLE_NAME,
      Key: {
        userId: { S: userId },
        platformUrl: { S: domain },
      },
    };
    console.log("get access token - params", params);

    const { Item } = await client.send(new GetItemCommand(params));

    console.log("Item", Item);

    if (!Item || !Item.accessToken) {
      throw new Error("AccessToken not found");
    }

    console.log("returning accessToken", Item.accessToken.S);
    return Item.accessToken.S;
  } catch (error) {
    console.error("Error getting access token", error);
    throw error;
  }
};
