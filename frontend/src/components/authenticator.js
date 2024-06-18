import axios from "axios";

export const authenticator = async () => {
  const clientSecret = "";
  const clientId = "";

  // const headers = {
  //   "Content-Type": "application/json",
  // };

  // const data = {
  //   client_id: clientId,
  //   client_secret: clientSecret,
  //   grant_type: "client_credentials",
  // };

  try {
    const response = await axios.post(
      `https://traintopia.docebosaas.com/oauth2/authorize`
    );
    console.log(response);
    return response;
  } catch (error) {
    return error.response.data;
  }
};
