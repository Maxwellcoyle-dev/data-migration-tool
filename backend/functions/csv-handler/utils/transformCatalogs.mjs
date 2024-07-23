const transformCatalogs = (data) => {
  const transformedData = data.map((row) => {
    return {
      code: row.code,
      name: row.name,
      ...(row.description && { description: row.description }),
    };
  });
  console.log("catalogData", transformedData);
  const batchCount = 300;
  return { transformedData, batchCount };
};

export default transformCatalogs;
