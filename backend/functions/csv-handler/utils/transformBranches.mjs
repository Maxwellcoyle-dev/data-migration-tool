const transformBranches = (data) => {
  const transformedData = data.map((row) => {
    const translations = {};
    // Loop over each property in the row
    for (const key in row) {
      // Check if the key starts with 'name_' which indicates a translation
      if (key.startsWith("name_")) {
        // Extract the language code after 'name_'
        const languageCode = key.split("_")[1];
        // Map the translation using the language code as the key
        translations[languageCode] = row[key];
      }
    }
    // Return the transformed object for each row
    return {
      code: row.code,
      translations: translations,
      ...(row.parent_code && { parent_code: row.parent_code }),
      ...(row.sibling && { sibling: row.sibling }),
    };
  });

  console.log("branchData", transformedData);
  return { transformedData, batchCount: 300 };
};

export default transformBranches;
