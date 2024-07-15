const courseResponseMap = (response, data) => {
  console.log("Mapping course response");
  // Create a map of code to catalog items

  const responseData = response.data.map((item, index) => {
    return {
      row_index: index + 1,
      course_name: data[index].course_name,
      success: item.success,
      message: item.message,
    };
  });
  return responseData;
};

export default courseResponseMap;
