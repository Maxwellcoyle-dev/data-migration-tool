export const branches = {
  importType: "branches",
  endpoint: "/manage/v1/orgchart/batch",
  httpMethod: "POST",
  requiredFields: [
    { field: "code", type: "string", description: `branch Code` },
    {
      field: "name_*",
      type: "string",
      description: `Localizable branch name. Such object is structured as {"language_code": "branch name in this language"}, where "language_code" is a valid language code (e.g. english, italian) or the "all" selector (i.e. same name for all languages). You can mix real language codes with "all" to override specific languages (e.g. {"all": "Common Name", "italian": "Nome italiano"}).`,
    },
  ],
  optionalFields: [
    {
      field: "parent_code",
      type: "string",
      description: `The code of the parent branch. If empty, it will be created under the root branch.`,
    },
    {
      field: "sibling",
      type: "string",
      description: `An optional branch code to keep synched with the current branch (only applicable if branch synchronization is available).`,
    },
  ],
  options: {
    update: {
      type: "boolean",
      label: "Update existing branches",
      description:
        "When set to TRUE, it will update an already existing branch instead of skipping it. Default value is FALSE (i.e. skip already existing branches).",
      defaultValue: false,
    },
  },
};
