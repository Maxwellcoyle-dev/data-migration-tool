export const courseTypeFields = {
  importType: "courses",
  endpoint: "/learn/v1/courses/batch",
  httpMethod: "POST",
  requiredFields: [
    {
      field: "course_type",
      type: "string",
      description: `The type of the course (elearning, webinar, classroom)`,
    },
    {
      field: "course_name",
      type: "string",
      description: `The name of the course`,
    },
    {
      field: "course_description",
      type: "string",
      description: `The description of the course`,
    },
  ],
  optionalFields: [
    {
      field: "course_code",
      type: "string",
      description: `The code of the course`,
    },
    {
      field: "course_provider",
      type: "string",
      description:
        "The CSP of the course (foreign key - needed only when importing external course from catalogue)",
    },
    {
      field: "external_course_id",
      type: "string",
      description:
        "If course_provider is provided, this represents the provider internal id. Ignored otherwise.",
    },
    {
      field: "course_cover",
      type: "string",
      description: "Course thumbnail encoded in the base64 format",
    },
    {
      field: "course_cover_id",
      type: "integer",
      description: "Course thumbnail id. Mutually exclusive with course_cover",
    },
    {
      field: "course_cover_name",
      type: "string",
      description:
        "Course thumbnail name. The name of an image in S3 (allowed types: jpg, png, gif)",
    },
    {
      field: "course_language",
      type: "string",
      description: "The language of the course",
    },
    {
      field: "course_published",
      type: "string",
      description:
        "Takes one of two values 'published' or 'unpublished'. 'published' is equal to set the course_status param to 2 and 'unpublished' to set it to 0",
    },
    {
      field: "course_category_id",
      type: "integer",
      description:
        "The LMS numeric ID of the target category. If provided, will prevail on 'course_category' parameter",
    },
    {
      field: "course_category",
      type: "string",
      description: "The code of the category of the course",
    },
    {
      field: "course_difficulty",
      type: "string",
      description:
        "Takes one of the following values 'veryeasy', 'easy', 'medium', 'difficult', 'verydifficult'",
    },
    {
      field: "user_enroll",
      type: "number",
      description:
        "Either 0 or 1, indicates whether to allow self enrollment of the course",
    },
    {
      field: "user_enroll_begin",
      type: "string",
      description:
        "The start of the date period during which self enrollment is allowed. Format yyyy-mm-dd",
    },
    {
      field: "user_enroll_end",
      type: "string",
      description:
        "The end of the date period during which self enrollment is allowed. Format yyyy-mm-dd",
    },
    {
      field: "course_avg_time",
      type: "string",
      description: "The average time of the course. Format HH:MM:SS",
    },
    {
      field: "course_for_sale",
      type: "number",
      description:
        "Either 0 or 1, indicates whether an elearning course is for sale",
    },
    {
      field: "course_price",
      type: "number",
      description:
        "The price of the course in cents of its currency. eg: 100 means the course costs 1",
    },
    {
      field: "course_status",
      type: "number",
      description:
        "The status of the course. Takes one of the following values 'In preparation', 'Available', 'Effective'",
    },
    {
      field: "course_credits",
      type: "number",
      description:
        "The credits assigned to the course multiplied by 100. eg. 250 indicates 2.5 credits",
    },
    {
      field: "course_max_subscriptions",
      type: "number",
      description: "The total number of subscriptions allowed in the course",
    },
    {
      field: "course_validity_begin",
      type: "string",
      description:
        "The start of the date period during which the course is valid. Format yyyy-mm-dd",
    },
    {
      field: "course_validity_end",
      type: "string",
      description:
        "The end of the date period during which the course is valid. Format yyyy-mm-dd",
    },
    {
      field: "batch_item_id",
      type: "string",
      description:
        "This will be returned as it is in the output. It's not course data, but may be useful in some processes",
    },
    {
      field: "content_partner_code",
      type: "string",
      description:
        "Content partner code to associate the content partner. When empty means 'no content partner'. Can be associated only with active content partners",
    },
    {
      field: "affiliate_price",
      type: "integer",
      description:
        "Valid only when there's a content_partner_code defined. When empty it will be automatically calculated based on the default content partner discount. It cannot be higher than affiliate price and it cannot be negative",
    },
    {
      field: "content_partner_fields",
      type: "LearnCourseBatchImportCoursesContentPartnerFields",
      description:
        "It allows defining the data for the content partner additional fields with type 'Customizable for each course'",
    },
    {
      field: "decommissioning",
      type: "LearnCourseBatchImportCoursesDecommissioning",
      description: "Decommissioning info",
    },
  ],
  options: {
    update_course_info: {
      type: "boolean",
      label: "Update existing course information",
      description:
        "If set to true, if a listed course already exists, its details will be updated. If set to false, an error will be logged for each existing course.",
      defaultValue: false,
    },
    use_code_to_update: {
      type: "boolean",
      label: "Use course code for updating",
      description:
        "If set to true and course_code is provided as a non-empty string, then the course_code would be used for course identification by the API. Otherwise, the course_name would be used as a fallback.",
      defaultValue: false,
    },
    s3_key: {
      type: "string",
      label: "Amazon S3 Key",
      description: "Amazon S3 Key of the shared files location.",
      defaultValue: "",
    },
    s3_secret: {
      type: "string",
      label: "Amazon S3 Secret",
      description: "Amazon S3 Secret of the shared files location.",
      defaultValue: "",
    },
    s3_region: {
      type: "string",
      label: "Amazon S3 Region",
      description: "Amazon S3 Region of the shared files location.",
      defaultValue: "",
    },
    s3_bucket_name: {
      type: "string",
      label: "Amazon S3 Bucket Name",
      description: "Amazon S3 Bucket Name of the shared files location.",
      defaultValue: "",
    },
    s3_root_folder: {
      type: "string",
      label: "Amazon S3 Root Folder",
      description:
        'Amazon Root Folder of the shared files location (Do not indicate the s3 root folder as "/". Use "." instead).',
      defaultValue: ".",
    },
  },
};
