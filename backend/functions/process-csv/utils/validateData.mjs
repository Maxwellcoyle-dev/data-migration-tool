export const validateBranchData = (data, requiredFields) => {
  try {
    const errors = [];
    const headers = Object.keys(data[0]);
    const missingRequiredFields = requiredFields.filter((field) => {
      if (field.field === "name_*") {
        return !headers.some((header) => header.startsWith("name_"));
      }
      return !headers.includes(field.field);
    });
    if (missingRequiredFields.length > 0) {
      errors.push(
        `Missing required fields: ${missingRequiredFields
          .map((field) => field.field)
          .join(", ")}`
      );
    }
    return errors;
  } catch (error) {
    console.error("Error validating branch data:", error);
    throw error;
  }
};

export const validateUserData = (data) => {
  try {
    const errors = [];
    data.forEach((row, index) => {
      if (!row.user_id && !row.username) {
        errors.push(
          `Row ${index + 1}: Missing required fields: user_id or username`
        );
      }
    });
    return errors;
  } catch (error) {
    console.error("Error validating user data:", error);
    throw error;
  }
};

export const validateData = (data, importType, requiredFields) => {
  try {
    console.log(`Validating data for import type: ${importType}`);
    switch (importType) {
      case "branches":
        return validateBranchData(data, requiredFields);
      case "users":
        return validateUserData(data);
      default:
        return [`Unknown import type: ${importType}`];
    }
  } catch (error) {
    console.error("Error in validateData function:", error);
    throw error;
  }
};
