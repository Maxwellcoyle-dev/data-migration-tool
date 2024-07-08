import axios from "axios";

export const createGroups = async (url, headers, data) => {
  console.log("Create groups initiated");
  let responseData = [];

  for (let i = 0; i < data.length; i++) {
    try {
      console.log("Docebo API request:", url, data[i]);
      const response = await axios.post(url, data[i], { headers });
      console.log("Docebo API response:", response.data);
      const groupResponse = {
        group_name: data[i].name,
        group_uuid: response.data.data.uuid,
        success: true,
      };
      responseData.push(groupResponse);
    } catch (error) {
      console.error("Docebo API error:", error);
      const errorResponse = {
        group_name: data[i].name,
        success: false,
        ...(error.response && {
          response_status: error.response.status,
          error_code: error.response.data.code,
          error_message: error.response.data.message[0],
        }),
      };
      console.log("Error response:", errorResponse);
      responseData.push(errorResponse);
    }
  }

  console.log("Docebo API responses:", responseData);
  return responseData;
};
