export const transformBranchData = (data) => {
  console.log("data", data);
  const branchData = data.map((row) => {
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
      sibling: row.sibling || null, // Use null if sibling is undefined
      parent_code: row.parent_code || null, // Use null if parent_code is undefined
    };
  });

  console.log("branchData", branchData);
  return branchData;
};

export const transformUserData = (data) => {
  return data.map((row) => {
    const transformedRow = {};

    // List of all possible fields
    const fields = [
      "user_id",
      "username",
      "first_name",
      "last_name",
      "new_username",
      "password",
      "timezone",
      "date_format",
      "active",
      "expiration_date",
      "level",
      "profile",
      "manager_xxx",
      "is_manager",
      "language",
      "branch_name_path",
      "branch_code_path",
      "branch_name",
      "branch_code",
      "field_xxx",
    ];

    // Iterate over the possible fields and add them to transformedRow if they exist in the row
    fields.forEach((field) => {
      if (row[field] !== undefined && row[field] !== null) {
        transformedRow[field] = row[field];
      }
    });

    return transformedRow;
  });
};

export const transformData = (data, importType) => {
  switch (importType) {
    case "branches":
      return transformBranchData(data);
    case "users":
      return transformUserData(data);
    // Add more cases for different import types
    default:
      throw new Error(`Unknown import type: ${importType}`);
  }
};
