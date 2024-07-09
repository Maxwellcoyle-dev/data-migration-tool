import axios from "axios";

export const createCatalogs = async (url, headers, data) => {
  console.log("Post to Docebo initiated");
  try {
    console.log("Docebo API request:", url, data);
    const response = await axios.post(url, data, { headers });
    console.log("Docebo API response:", response);
    console.log("Docebo API response.data:", response.data);
    if (response.data.data) {
      console.log("Docebo API response.data:", response.data.data);
    }
    // Create a map of code to catalog items
    const catalogMap = new Map(data.items.map((item, index) => [index, item]));
    const responseData = response.data.data.map((item, index) => {
      const catalogItem = catalogMap.get(index);
      if (!catalogItem) {
        console.error(`No catalog item found at index ${index}`);
        return {
          row_index: index,
          catalog_code: null,
          success: item.success,
          message: item.message || "No corresponding catalog item found",
        };
      }
      return {
        row_index: index,
        catalog_code: catalogItem.code,
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
