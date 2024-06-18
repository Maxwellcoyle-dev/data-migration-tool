import axios from "axios";

export const handler = async (event) => {
  console.log("Function Initiated --- EVENT: ", event);
  let code;
  let clientId;
  let clientSecret;
  let domain;

  if (event.httpMethod === "GET") {
    const params = event.queryStringParameters;
    console.log("GET - params", params);
    code = params.code;
    const state = JSON.parse(decodeURIComponent(params.state));
    clientId = state.clientId;
    clientSecret = state.clientSecret;
    domain = state.domain;
    console.log("GET - code", code);
  }

  const redirectUri = `https://ug6n0hw9wg.execute-api.us-east-2.amazonaws.com/Stage/callback`;

  try {
    const response = await axios.post(
      `https://${domain}/oauth2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
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

    const { access_token } = response.data;
    console.log("access_token", access_token);

    const frontEndUrl = `http://localhost:3000/callback?access_token=${access_token}`;
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
