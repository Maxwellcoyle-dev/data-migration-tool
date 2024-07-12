const catalogResponseMap = (response, data) => {
  console.log("Mapping catalog response");
  // Create a map of code to catalog items

  const catalogMap = new Map(data.map((item, index) => [index, item]));

  const responseData = response.data.map((item, index) => {
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
};

export default catalogResponseMap;
