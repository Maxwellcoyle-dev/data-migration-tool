export const catalogItems = {
  importType: "catalog_items",
  endpoint: "/learn/v1/catalog/items/batch",
  httpMethod: "POST",
  requiredFields: [
    {
      field: "catalog_code",
      type: "string",
      description: "The code of the catalogue that this item belongs to",
    },
    {
      field: "item_code",
      type: "string",
      description: "The code of the item which we want to subscribe",
    },
    {
      field: "item_type",
      type: "string",
      description: 'The type of the item, can be "course" or "learning_plan".',
    },
  ],
  optionalFields: [],
  options: {},
};
