export const transformGroups = (data) => {
  const groupData = data.map((row) => {
    return {
      name: row.name,
      description: row.description,
      type: "manual",
    };
  });
  console.log("groupData", groupData);
  return groupData;
};
