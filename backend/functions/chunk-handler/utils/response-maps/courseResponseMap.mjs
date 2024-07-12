const courseResponseMap = (response, data) => {
  console.log("Mapping course response");
  // Create a map of code to catalog items

  const responseData = response.data.map((item) => {
    return {
      row_index: item.row_index,
      course_name: data[item.row_index].course_name,
      course_id: item.course_id,
      success: item.success,
      message: item.message,
    };
  });
  return responseData;
};

export default courseResponseMap;
