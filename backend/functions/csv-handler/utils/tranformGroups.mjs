const transformGroups = (data) => {
  const transformedData = data.map((row) => {
    return {
      name: row.name,
      description: row.description,
      type: "manual",
    };
  });
  console.log("groupData", transformedData);
  const batchCount = 25;
  return { transformedData, batchCount };
};
export default transformGroups;
