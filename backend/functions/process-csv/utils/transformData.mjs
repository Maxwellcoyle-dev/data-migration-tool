export const transformBranchData = (data) => {
  try {
    console.log("Transforming branch data:", data);
    const branchData = data.map((row) => {
      const translations = {};
      for (const key in row) {
        if (key.startsWith("name_")) {
          const languageCode = key.split("_")[1];
          translations[languageCode] = row[key];
        }
      }
      return {
        code: row.code,
        translations: translations,
        ...(row.sibling && { sibling: row.sibling }),
        ...(row.parent_code && { parent_code: row.parent_code }),
      };
    });
    console.log("Transformed branch data:", branchData);
    return branchData;
  } catch (error) {
    console.error("Error transforming branch data:", error);
    throw error;
  }
};

export const transformUserData = (data) => {
  try {
    console.log("Transforming user data:", data);
    const transformedData = data.map((row) => {
      const transformedRow = {};
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
      fields.forEach((field) => {
        if (row[field] !== undefined && row[field] !== null) {
          transformedRow[field] = row[field];
        }
      });
      return transformedRow;
    });
    console.log("Transformed user data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error transforming user data:", error);
    throw error;
  }
};

export const transformData = (data, importType) => {
  try {
    console.log(`Transforming data for import type: ${importType}`);
    switch (importType) {
      case "branches":
        return transformBranchData(data);
      case "users":
        return transformUserData(data);
      default:
        throw new Error(`Unknown import type: ${importType}`);
    }
  } catch (error) {
    console.error("Error in transformData function:", error);
    throw error;
  }
};
