const transformCatalogs = (data) => {
  const catalogData = data.map((row) => {
    return {
      code: row.code,
      name: row.name,
      ...(row.description && { description: row.description }),
    };
  });
  console.log("catalogData", catalogData);
  return catalogData;
};

export default transformCatalogs;
