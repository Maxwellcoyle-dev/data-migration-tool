export const catalogs = {
  importType: "catalogs",
  endpoint: "/learn/v1/catalog/batch",
  httpMethod: "POST",
  requiredFields: [
    {
      field: "code",
      type: "string",
      description: `The code of the catalog to create`,
    },
    {
      field: "name",
      type: "string",
      description: `The name of the catalog`,
    },
  ],
  optionalFields: [
    {
      field: "description",
      type: "string",
      description: `An optional HTML description of the catalog`,
    },
  ],
  options: {},
};
