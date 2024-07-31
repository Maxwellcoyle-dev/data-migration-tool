const catalogItemsResponseMap = (response, data) => {
  console.log("Mapping catalog response");
  // Create a map of code to catalog items

  const catalogItemMap = new Map(data.map((item, index) => [index, item]));

  const responseData = response.data.map((item, index) => {
    const catalogItem = catalogItemMap.get(index);
    if (!catalogItem) {
      console.error(`No catalog item found at index ${index}`);
      return {
        row_index: index,
        catalog_code: null,
        item_code: null,
        item_type: null,
        success: item.success,
        message: item.message || "No corresponding catalog item found",
      };
    }
    return {
      row_index: index,
      catalog_code: catalogItem.catalog_code,
      item_code: catalogItem.item_code,
      item_type: catalogItem.item_type,
      success: item.success,
      message: item.message,
    };
  });

  return responseData;
};

export default catalogItemsResponseMap;
