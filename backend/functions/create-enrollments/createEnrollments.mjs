import axios from "axios";

export const createEnrollments = async (url, headers, data) => {
  console.log("Post to Docebo initiated");
  try {
    console.log("Docebo API request:", url, data);
    const response = await axios.post(url, data, { headers });
    console.log("Docebo API response:", response);
    console.log("Docebo API response.data:", response.data);
    if (response.data.data) {
      console.log("Docebo API response.data:", response.data.data);
    }

    const responseData = response.data.data.map((item) => {
      return {
        row_index: item.row_index,
        course_id: item.course_id,
        user_id: item.user_id,
        ...(item.learning_plan_id && {
          learning_plan_id: item.learning_plan_id,
        }),
        ...(item.session_id && { session_id: item.session_id }),
        success: item.success,
        message: item.message,
      };
    });
    return responseData;
  } catch (error) {
    console.error("Docebo API error:", error);
    // Check if the error has response data
    if (error.response) {
      const errorResponse = {
        success: false,
        data: error.response.data,
        status: error.response.status,
      };
      console.log("Error response:", errorResponse);
      return errorResponse;
    } else {
      return { success: false, message: error.message };
    }
  }
};
