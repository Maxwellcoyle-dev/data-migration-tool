const transformCatalogItems = (data) => {
  const transformedData = data.map((row) => {
    return {
      catalog_code: row.catalog_code,
      item_code: row.item_code,
      item_type: row.item_type,
    };
  });
  console.log("catalogItemsData", transformedData);
  return { transformedData, batchCount: 100 };
};

export default transformCatalogItems;
