import { branchTypeFields } from "./typeFields";

export const validateBranches = (data) => {
  const requiredFields = branchTypeFields.requiredFields;
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
