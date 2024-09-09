const enrollmentResponseMap = (response, data) => {
  console.log("Mapping course response");
  // Create a map of code to catalog items

  // Filter out items where success is true
  const failedResponses = response.data.filter((item) => !item.success);

  // Map over the failed items to create the response
  const responseData = failedResponses.map((item) => {
    console.log("Mapping course response for failed items");
    console.log(item);

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
};

export default enrollmentResponseMap;
