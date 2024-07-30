const learningObjectResponseMap = (response, data) => {
  console.log("Mapping learning object response");
  console.log("Response:", response);
  console.log("Data:", data);
  // Create a map of code to catalog items

  const responseData = response.data.map((item, index) => {
    return {
      row_index: item.row_index,
      ...(data[index].course_code && { course_code: data[index].course_code }),
      ...(data[index].course_id && { course_id: data[index].course_id }),
      ...(data[index].lo_code && { lo_code: data[index].lo_code }),
      ...(data[index].lo_type && { lo_type: data[index].lo_type }),
      ...(data[index].lo_name && { lo_name: data[index].lo_name }),
      success: item.success,
      message: item.message,
    };
  });
  return responseData;
};

export default learningObjectResponseMap;
