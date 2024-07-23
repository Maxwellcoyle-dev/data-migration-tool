const branchResponseMap = (response, data) => {
  console.log("Mapping branch response");
  // Create a map of code to catalog items

  console.log("data", data);
  console.log("response", response.data);

  const responseData = response.data.map((item, index) => {
    return {
      row_index: index + 1,
      branch_name: data[index].translations.english,
      branch_code: data[index].code,
      success: item.success,
      message: item.message,
    };
  });
  return responseData;
};

export default branchResponseMap;
