export const typeFields = {
  branches: {
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
  },
  users: {
    importType: "users",
    endpoint: "/manage/v1/user/batch",
    httpMethod: "POST",
    requiredFields: [
      {
        field: "user_id",
        type: "integer",
        description: `The numeric id for a user. Required if no username is specified for the item. Do not fill if the "username" field has been specified.`,
      },
      {
        field: "username",
        type: "string",
        description: `The unique username for a user. Required if no user_id is specified for the item. Do not fill if the "user_id" field has been specified. Will be ignored if checked "Use Email as Username" in "Advanced Settings".`,
      },
    ],
    optionalFields: [
      { field: "first_name", type: "string", description: `User's first name` },
      { field: "last_name", type: "string", description: `User's last name` },
      {
        field: "new_username",
        type: "string",
        description: `If specified, updates the current username with this new one. The update_user_info option must be set as true.`,
      },
      {
        field: "password",
        type: "string",
        description: `Set a user's password`,
      },
      {
        field: "timezone",
        type: "string",
        description: `Set a user's timezone, eg: Europe/Rome`,
      },
      {
        field: "date_format",
        type: "string",
        description: `Date format (e.g. 'ar', 'ar_dz', 'bg', 'en', 'en-gb', 'en_gb', 'it', 'es', etc)`,
      },
      {
        field: "active",
        type: "boolean",
        description: `Is a user active (true) or suspended (false)`,
      },
      {
        field: "expiration_date",
        type: "string",
        description: `End the validity of a user account to a certain date. The value can be empty. If not empty, it must bin YYYY-MM-DD format (Eg: 2018-12-31`,
      },
      {
        field: "level",
        type: "string",
        description: `The user's permissions. This will be either "user", "poweruser" or "superadmin". If omitted, defaults to "user"`,
      },
      {
        field: "profile",
        type: "string",
        description: `Will be the profile name for the Power User. Will be ignored if the user level is "user". If new power user management is active, more profiles can be passed as array ( ["profile1","profile2"] ) or as string with | delimitator ( "profile1|profile2" )`,
      },
      {
        field: "manager_xxx",
        type: "string",
        description: `Multiple manager types may be added. Simply replace "xxx" with the right manager type ID. Ex: "manager_1":"username". Use null to remove the manager association`,
      },
      {
        field: "is_manager",
        type: "boolean",
        description: `Flag determining if the user is a manager or not`,
      },
      {
        field: "langauge",
        type: "string",
        description: `Set the platform language for the user`,
      },
      {
        field: "branch_name_path",
        type: "string",
        description: `Points to a full branch path, separated by slashes. If any part of the branch does not exist yet, it will be automatically created if the "force_create_branches" is TRUE (eg: branch 1/branch 2/branch 3). If no one are found, the "destination_branch" options field will be used as fallback`,
      },
      {
        field: "branch_code_path",
        type: "string",
        description: `Points to the codes of a full branch path, separated by slashes. If a part of the branch does not exist yet, it will be automatically created if the "force_create_branches" is TRUE (eg: b01/b02/b03). In order to create a new branch, both name and code are required. They must be composed of the same structure. If something fails, an error will be shown. If no one are found, the "destination_branch" options field will be used as fallback.`,
      },
      {
        field: "branch_name",
        type: "string",
        description: `Identify a branch by name. It is used if "branch_name_path" or "branch_code_path" fields are not provided. If the branch is not found, the "destination_branch" options field will be used as fallback. If multiple branches with the same name are found, an error will be shown.`,
      },
      {
        field: "branch_code",
        type: "string",
        description: `Identify a branch by its code. It is used if "branch_name" field is not provided. If not found, the "destination_branch" options field will be used as fallback. If multiple branches with the same code are found, an error will be shown.`,
      },
      {
        field: "field_xxx",
        type: "string",
        description: `Multiple additional fields may be added. Simply replace "xxx" with the right field ID (do not use the "human" additional field name`,
      },
    ],
    options: {
      change_user_password: {
        type: "boolean",
        label: "change user password",
        description:
          "If set to true, all newly created users will need to update their password when first logging in",
        defaultValue: false,
      },
      update_user_info: {
        type: "boolean",
        label: "update user info",
        description:
          "If set to true, if a listed user already exists, his details will be updated, if set to false, an error will be logged for each existing user",
        defaultValue: false,
      },
      ignore_password_change_for_existing_users: {
        type: "boolean",
        label: "ignore password change for existing users",
        description:
          "If set to false, all updated users will need to update their password when logging in next time (only has any effect when update_existing_users is true as well)",
        defaultValue: false,
      },
      powerUser_option: {
        type: "dropdown",
        label: "powerUser option",
        options: [
          "no_association",
          "assigned_branch",
          "assigned_branch_descendants",
        ],
        description: `Can be "no_association", "assigned_branch" or "assigned_branch_descendants". When "no_association" is selected he will not get associated. When "assigned_branch" or "assigned_branch_descendants" is selected he will be automatically assigned to the branch or to the branch and the descendants he is added to (reflects branch_name, branch_code, branch_name_path and branch_code_path settings).`,
        defaultValue: "no_association",
      },
      destination_branch: {
        type: "integer",
        label: "destination branch",
        description: `Refers to the internal ID for a branch used as a fallback when no one of "branch_name_path", "branch_code_path", "branch_name" or "branch_code" settings have been set or found. This parameter is mandatory only when "branch_option" is "existing"!`,
        defaultValue: NaN,
      },
      branch_option: {
        type: "dropdown",
        label: "branch option",
        options: ["existing", "do_nothing"],
        description: `Can be "existing" or "do_nothing". When "existing" is selected, an error will be thrown when not a unique branch can be identified. When "do_nothing" is selected, "update_user_info" is set to TRUE and there is no branch mapped for the current user then user's branches will not be changed.`,
        defaultValue: "do_nothing",
      },
      force_create_branches: {
        type: "boolean",
        label: "force create branches",
        description: `"When "force_create_branches" is selected, "branch_name_path" and "branch_code_path" are used and both columns have proper value, a new branch will be created."`,
        defaultValue: false,
      },
      user_destination_branch_action: {
        type: "dropdown",
        label: "user destination branch action",
        options: ["add", "move"],
        description: `This parameter would not be working for platforms created after 16/10/2019. If it's not provided the users would be added to new branches. If it's set to "add" the users would be added to new branches. If its value is "move", the users would be added to new branches and removed from all the previous ones.`,
        defaultValue: "add",
      },
      send_notification_email: {
        type: "boolean",
        label: "send_notification_email",
        description: `Indicates whether to send the notification to the created users`,
        defaultValue: false,
      },
      multi_profiles_mode: {
        type: "dropdown",
        label: "multi profiles mode",
        options: ["add_profile", "overwrite_profiles"],
        description: `Add_profile will add the new profile to power user without modify the already assigned profile. Overwrite_profiles remove the already assigned profile to assign only the new ones. Default overwrite_profiles. This parameter would work only if the new power user management is active.`,
        defaultValue: "overwrite_profiles",
      },
      provisioned_by: {
        type: "string",
        label: "provisioned by",
        description: `External provisioning source`,
        defaultValue: "",
      },
    },
  },
};
