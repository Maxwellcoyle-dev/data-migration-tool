import axios from "axios";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });

const REDIRECT_URI = process.env.CALLBACK_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;
const TABLE_NAME = process.env.ACCESS_TOKEN_TABLE_NAME;

export const handler = async (event) => {
  console.log("Function Initiated --- EVENT: ", event);

  console.log("env variables -- ", { REDIRECT_URI, FRONTEND_URL, TABLE_NAME });

  const params = event.queryStringParameters;
  console.log("GET - params", params);
  const code = params.code;
  const state = JSON.parse(decodeURIComponent(params.state));
  console.log("GET - state", state);
  const clientId = state.clientId;
  const clientSecret = state.clientSecret;
  const domain = state.domain;
  const userId = state.userId;

  console.log("GET - code", code);

  console.log("redirect URI", REDIRECT_URI);

  try {
    const response = await axios.post(
      `https://${domain}/oauth2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("response", response.data);

    const { access_token, refresh_token } = response.data;
    const timeStamp = new Date().toISOString();
    console.log("access_token", access_token);

    // Save the access_token to DynamoDB - partition key is userId and sort key is platformUrl
    // send additional params - refreshToken, timeStamp, accessToken
    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId: { S: userId },
        platformUrl: { S: domain },
        accessToken: { S: access_token },
        refreshToken: { S: refresh_token },
        timeStamp: { S: timeStamp },
        clientId: { S: clientId },
        clientSecret: { S: clientSecret },
      },
    };

    try {
      const data = await client.send(new PutItemCommand(params));
      console.log("data", data);
    } catch (error) {
      console.error("Error", error);
    }

    const frontEndUrl = `${FRONTEND_URL}${access_token}`;

    console.log("frontEndUrl", frontEndUrl);
    return {
      statusCode: 302,
      headers: {
        Location: frontEndUrl,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }
};
