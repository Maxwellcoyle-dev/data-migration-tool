export const learningObjects = {
  importType: "learning_objects",
  endpoint: "/learn/v1/lo/batch",
  httpMethod: "POST",
  requiredFields: [
    {
      field: "course_code",
      type: "string",
      description: `The code of the course placeholder where the training material is going to be created. Required if course_id is empty`,
    },
    {
      field: "course_id",
      type: "integer",
      description: `The id of the course placeholder where the training material is going to be created. Required if course_code is empty.`,
    },
    {
      field: "lo_name",
      type: "string",
      description: `The name of the training material (supposed to be unique inside the course).`,
    },
    {
      field: "lo_type",
      type: "string",
      description: `Identifies the type of object contained in the current row. Can be scorm, file, video, tincan, aicc, html, test, slides_converter or dli.`,
    },
  ],
  optionalFields: [
    {
      field: "lo_code",
      type: "string",
      description: `Code of the learning object.`,
    },
    {
      field: "lo_filename",
      type: "string",
      description: `Filename complete with file extension which points to a shared physical file (f.e. scorm.zip).`,
    },
    {
      field: "lo_url",
      type: "string",
      description: `Url of the learning object. Mandatory only if filename is empty and lo_type is TinCan or Video.`,
    },
    {
      field: "lo_description",
      type: "string",
      description: `Extended description of the training material.`,
    },
    {
      field: "lo_thumbnail",
      type: "string",
      description: `Training material thumbnail (only used in Player’s List View mode).`,
    },
    {
      field: "lo_content",
      type: "string",
      description: `Training material content (only applicable to html object type).`,
    },
    {
      field: "mobile_use_external_link",
      type: "boolean",
      description: `Can be used only when the external tin can play is enabled in the platform, the lo type is TinCan and the lo_url is filled in.`,
    },
    {
      field: "lo_tincan_salt",
      type: "string",
      description: `Define the SALT Secret Key for the External TinCan.`,
    },
    {
      field: "lo_oauth_client",
      type: "string",
      description: `ID of the OAuth client to be used to play the External TinCan.`,
    },
    {
      field: "lo_enable_oauth",
      type: "boolean",
      description: `Enable the OAuth client to play the External TinCan.`,
    },
    {
      field: "lo_external_source_url",
      type: "string",
      description: `A public URL of the physical file associated with the Learning object.`,
    },
    {
      field: "lo_track_all_activities",
      type: "boolean",
      description: `Define if all activities of the LO should be tracked. Default value is TRUE.`,
    },
    {
      field: "launch_mode",
      type: "string",
      description: `Set "in_line" to open the object inside the player, "lightbox" to open the object inside a Lightbox, "new_window" to open the object in a new window or new tab in your browser (depending on your browser settings), "fullscreen" to open the object in full screen.`,
    },
  ],
  options: {
    s3_key: {
      type: "string",
      label: "Amazon S3 Key",
      description: "Amazon S3 Key of the shared files location",
      defaultValue: "",
    },
    s3_secret: {
      type: "string",
      label: "Amazon S3 Secret",
      description: "Amazon S3 Secret of the shared files location",
      defaultValue: "",
    },
    s3_region: {
      type: "string",
      label: "Amazon S3 Region",
      description: "Amazon S3 Region of the shared files location",
      defaultValue: "",
    },
    s3_bucket_name: {
      type: "string",
      label: "Amazon S3 Bucket Name",
      description: "Amazon S3 Bucket Name of the shared files location",
      defaultValue: "",
    },
    s3_root_folder: {
      type: "string",
      label: "Amazon S3 Root Folder",
      description:
        "Amazon Root Folder of the shared files location (Do not indicate the s3 root folder as '/'. Use '.' instead)",
      defaultValue: "",
    },
    unique_based_on_type: {
      type: "boolean",
      label: "Unique Based on Type",
      description:
        "When this parameter is passed as true, the API would check if LO with name/code AND type already exists in given course. Default: false",
      defaultValue: false,
    },
  },
};
