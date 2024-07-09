import { typeFields } from "./typeFields";

const validateGroupData = (data, importType) => {
  const requiredFields = typeFields[importType].requiredFields;
  const errors = [];
  const headers = data[0];

  if (!headers) {
    errors.push("No headers found in the CSV file.");
    return errors;
  }

  const missingRequiredFields = requiredFields.filter(
    (field) => !headers.includes(field.field)
  );

  if (missingRequiredFields.length > 0) {
    errors.push(
      `Missing required fields: ${missingRequiredFields
        .map((field) => field.field)
        .join(", ")}`
    );
  }

  return errors;
};

const validateCatalogData = (data, importType) => {
  const requiredFields = typeFields[importType].requiredFields;
  const errors = [];
  const headers = data[0];

  if (!headers) {
    errors.push("No headers found in the CSV file.");
    return errors;
  }

  const missingRequiredFields = requiredFields.filter(
    (field) => !headers.includes(field.field)
  );

  if (missingRequiredFields.length > 0) {
    errors.push(
      `Missing required fields: ${missingRequiredFields
        .map((field) => field.field)
        .join(", ")}`
    );
  }

  return errors;
};

const validateBranchData = (data, importType) => {
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

const validateCourseData = (data, importType) => {
  const requiredFields = typeFields[importType].requiredFields;
  const errors = [];
  const headers = data[0];

  if (!headers) {
    errors.push("No headers found in the CSV file.");
    return errors;
  }

  const missingRequiredFields = requiredFields.filter(
    (field) => !headers.includes(field.field)
  );

  if (missingRequiredFields.length > 0) {
    errors.push(
      `Missing required fields: ${missingRequiredFields
        .map((field) => field.field)
        .join(", ")}`
    );
  }

  return errors;
};

export const validateData = (data, importType) => {
  switch (importType) {
    case "branches":
      return validateBranchData(data, importType);
    case "courses":
      return validateCourseData(data, importType);
    case "groups":
      return validateGroupData(data, importType);
    case "catalogs":
      return validateCatalogData(data, importType);
    default:
      return [`Unknown import type: ${importType}`];
  }
};
