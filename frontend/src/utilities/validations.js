import { typeFields } from "./typeFields";

export const validateBranchData = (data, importType) => {
  const requiredFields = typeFields[importType].requiredFields;
  console.log("Data:", data);
  console.log("Required Fields:", requiredFields);

  const errors = [];
  const headers = data[0];

  if (!headers) {
    errors.push("No headers found in the CSV file.");
    return errors;
  }

  // Check for missing required fields
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
};

export const validateUserData = (data) => {
  const errors = [];
  const headers = data[0];

  if (!headers) {
    errors.push("No headers found in the CSV file.");
    return errors;
  }

  data.forEach((row, index) => {
    if (!row.user_id && !row.username) {
      errors.push(
        `Row ${index + 1}: Missing required fields: user_id or username`
      );
    }
  });

  return errors;
};

export const validateData = (data, importType) => {
  switch (importType) {
    case "branches":
      return validateBranchData(data, importType);
    case "users":
      return validateUserData(data);
    default:
      return [`Unknown import type: ${importType}`];
  }
};
