import types from "./types";

const validateGroupData = (data, importType) => {
  const requiredFields = types(importType).requiredFields;
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
  const requiredFields = types(importType).requiredFields;
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

const validateCatalogItemsData = (data, importType) => {
  const requiredFields = types(importType).requiredFields;
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
  const requiredFields = types(importType).requiredFields;
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

const validateEnrollmentData = (data, importType) => {
  const requiredFields = types(importType).requiredFields;
  const errors = [];
  const headers = data[0];

  if (!headers) {
    errors.push("No headers found in the CSV file.");
    return errors;
  }

  const fieldPresent = (fields) =>
    fields.some((field) => headers.includes(field.field));

  // Check if either course_code or course_id is present
  const courseFieldPair = requiredFields.filter((field) =>
    ["course_code", "course_id"].includes(field.field)
  );
  if (!fieldPresent(courseFieldPair)) {
    errors.push(`Missing required field: either course_code or course_id`);
  }

  // Check if either username or user_id is present
  const userFieldPair = requiredFields.filter((field) =>
    ["username", "user_id"].includes(field.field)
  );
  if (!fieldPresent(userFieldPair)) {
    errors.push(`Missing required field: either username or user_id`);
  }

  return errors;
};

const validateCourseData = (data, importType) => {
  const requiredFields = types(importType).requiredFields;
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

const validateLearningObjectData = (data, importType) => {
  const requiredFields = types(importType).requiredFields;
  console.log("Data:", data);
  console.log("Required Fields:", requiredFields);

  const errors = [];
  const headers = data[0];

  if (!headers) {
    errors.push("No headers found in the CSV file.");
    return errors;
  }

  const fieldPresent = (fields) =>
    fields.some((field) => headers.includes(field.field));

  // Check if either course_code or course_id is present
  const courseFieldPair = requiredFields.filter((field) =>
    ["course_code", "course_id"].includes(field.field)
  );
  if (!fieldPresent(courseFieldPair)) {
    errors.push(`Missing required field: either course_code or course_id`);
  }

  // Check for other required fields
  const missingRequiredFields = requiredFields.filter((field) => {
    if (["course_code", "course_id"].includes(field.field)) {
      return false; // Already checked
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
    case "catalog_items":
      return validateCatalogItemsData(data, importType);
    case "enrollments":
      return validateEnrollmentData(data, importType);
    case "learning_objects":
      return validateLearningObjectData(data, importType);
    default:
      return [`Unknown import type: ${importType}`];
  }
};
