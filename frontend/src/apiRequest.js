import axios from "axios";

const apiRequest = async () => {
  const accessToken = localStorage.getItem("docebo_access_token");

  try {
    const response = await axios.get(
      `https://<yoursubdomain.docebosaas.com>/learn/v1/courses`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

export default apiRequest;
