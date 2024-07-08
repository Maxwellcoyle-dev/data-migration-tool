export const groupTypeFields = {
  importType: "groups",
  endpoint: "/audiences/v1/audience",
  httpMethod: "POST",
  requiredFields: [
    { field: "name", type: "string", description: `Name of the group` },
    {
      field: "description",
      type: "string",
      description: `Description of the group`,
    },
  ],
  optionalFields: [],
  options: {},
};
