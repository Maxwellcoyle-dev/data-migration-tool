const courseResponseMap = (response, data) => {
  console.log("Mapping course response");
  // Create a map of code to catalog items

  const responseData = response.data.map((item, index) => {
    let message;
    console.log("item", item);
    console.log("item.message", item.message);
    // Check if the message contains a PHP-like array structure
    if (item.message.includes("Array")) {
      console.log("Handling PHP-like array structure");
      console.log("item.message", item.message);
      message = "Description cannot be blank";
    } else {
      message = item.message;
    }

    return {
      row_index: index + 1,
      course_name: data[index].course_name,
      success: item.success,
      message: message,
    };
  });
  return responseData;
};

export default courseResponseMap;
