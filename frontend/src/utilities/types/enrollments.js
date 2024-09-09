export const enrollments = {
  importType: "enrollments",
  endpoint: "/learn/v1/enrollment/batch",
  httpMethod: "POST",
  requiredFields: [
    {
      field: "course_code",
      type: "string",
      description: "The code of the course",
    },
    {
      field: "course_id",
      type: "integer",
      description:
        "The numeric ID of the course in the LMS. It can be omitted if a valid 'course_code' parameter is provided",
    },
    {
      field: "username",
      type: "string",
      description:
        "The LMS username of the user. It can be specified instead of 'user_id' parameter",
    },
    {
      field: "user_id",
      type: "string",
      description:
        "The ID of the user. It can be omitted if a valid 'username' parameter is provided",
    },
  ],
  optionalFields: [
    {
      field: "session_code",
      type: "string",
      description: "(optional) The code of the session",
    },
    {
      field: "session_id",
      type: "integer",
      description: "(optional) The id of the session",
    },
    {
      field: "level",
      type: "string",
      description:
        "(optional) Enrollment level, 'student' and 'learner' are identical. For new ILT courses, instructors cannot be enrolled. Can be student, tutor, instructor, coach or learner",
    },
    {
      field: "status",
      type: "string",
      description:
        "(optional) This field is required if NOT set inside the 'options' object. Can be subscribed, in_progress, completed, waiting, to_confirm or suspended",
    },
    {
      field: "enrollment_date",
      type: "string",
      description:
        "Date of insert (YYYY-MM-DD HH:MM:SS e.g '2015-06-30 12:00:00')",
    },
    {
      field: "completion_date",
      type: "string",
      description:
        "(optional) Date of last complete (YYYY-MM-DD HH:MM:SS e.g '2015-06-30 12:00:00')",
    },
    {
      field: "active_from",
      type: "string",
      description:
        "(optional) Start date of the enrollment in UTC (YYYY-MM-DD HH:MM:SS e.g '2019-06-30 12:00:00')",
    },
    {
      field: "active_until",
      type: "string",
      description:
        "(optional) Expiry date of the enrollment in UTC (YYYY-MM-DD HH:MM:SS e.g '2015-06-30 12:00:00')",
    },
    { field: "score", type: "string", description: "(optional) Score given" },
    {
      field: "subscription_code",
      type: "string",
      description: "(optional) Code of subscription",
    },
    {
      field: "evaluation_text",
      type: "string",
      description: "(optional) Evaluation text (only for ILT)",
    },
    {
      field: "evaluation_date",
      type: "string",
      description:
        "(optional) Evaluation date (only for ILT) (e.g '2015-06-30')",
    },
    {
      field: "evaluation_score",
      type: "string",
      description: "(optional) Evaluation score (only for ILT)",
    },
    {
      field: "passed",
      type: "boolean",
      description:
        "(optional) Indicates if the user passed or not (true or false)",
    },
    {
      field: "present",
      type: "boolean",
      description:
        "(optional) Indicates if the user was present at the session. If set to true, the user attendance is set to 'Present' for all the events of the session. It is ignored otherwise.",
    },
    {
      field: "timezone",
      type: "string",
      description:
        "(optional) Time zone: UTC, Europe/Sofia, etc. It applies only to enrollment_date and completion_date fields. Default: 'UTC'",
    },
    {
      field: "field_xxx",
      type: "string",
      description:
        "(optional) Multiple additional fields may be added. Simply replace 'xxx' with the right field ID (do not use the 'human' additional field name",
    },
    {
      field: "batch_item_id",
      type: "string",
      description:
        "(optional) Client-specified ID for the current batch item. IT will be returned in the output as it is",
    },
    {
      field: "dates",
      type: "array",
      description: "(optional) Dates for session (only for ILT)",
    },
    {
      field: "assignment_type",
      type: "string",
      description:
        "(optional) Assignment Type enrollment attribute. Can be passed only when the attribute is configured in the platform advanced settings. The possible values are 'mandatory', 'required', 'recommended', 'optional' but to be accepted they must be enabled in the settings. This parameter is optional.",
    },
  ],
  options: {
    timezone: {
      type: "string",
      label: "Time Zone",
      description:
        "(optional) It applies to all enrollments that don’t have a time zone defined",
      defaultValue: "UTC",
    },
    enroll_disabled_users: {
      type: "boolean",
      label: "Enroll Disabled Users",
      description:
        "(optional) Allow enrollments for deactivated and expired users. This can be used only by SuperAdmins.",
      defaultValue: false,
    },
    duplicates_as_recertification: {
      type: "boolean",
      label: "Duplicates as Recertification",
      description:
        "(optional) If set to true, consider duplicate enrollments as recertification records. This is considered only when there is no reference to a session in input",
      defaultValue: false,
    },
    course_id: {
      type: "integer",
      label: "Course ID",
      description:
        "(optional) If it is set, it has higher priority over 'course_code' and 'course_id' sent outside these 'options' object",
      defaultValue: null,
    },
    session_id: {
      type: "integer",
      label: "Session ID",
      description:
        "(optional) If it is set, it has higher priority over 'session_code' and 'session_id' sent outside these 'options' object",
      defaultValue: null,
    },
    enable_waitinglist: {
      type: "boolean",
      label: "Enable Waiting List",
      description:
        "(optional) In case the waiting list parameter is turned 'true', the course waiting list needs to be respected, otherwise not. Default - 'false'",
      defaultValue: false,
    },
    enrollment_date_now: {
      type: "boolean",
      label: "Enrollment Date Now",
      description:
        "(optional) In case this parameter is turned 'true', Enrollment Date will be set to 'now'. Default - 'false'",
      defaultValue: false,
    },
    status: {
      type: "string",
      label: "Status",
      description:
        "(optional) If it is set, it has higher priority over 'status' sent outside these 'options' object. This field is required if NOT set inside the 'items' objects. Can be subscribed, in_progress, completed, waiting, to_confirm or suspended",
      defaultValue: "",
    },
    level: {
      type: "string",
      label: "Level",
      description:
        "(optional) Enrollment level, 'student' and 'learner' are identical. For new ILT courses, instructors cannot be enrolled. Can be student, tutor, instructor, coach or learner",
      defaultValue: "student",
    },
    active_from: {
      type: "string",
      label: "Active From",
      description:
        "(optional) Start date of the enrollment. (YYYY-MM-DD HH:MM:SS e.g '2019-06-30 12:00:00')",
      defaultValue: null,
    },
    active_until: {
      type: "string",
      label: "Active Until",
      description:
        "(optional) Expiry date of the enrollment (YYYY-MM-DD HH:MM:SS e.g '2015-06-30 12:00:00')",
      defaultValue: null,
    },
    trigger_notifications: {
      type: "boolean",
      label: "Trigger Notifications",
      description:
        "(optional) Trigger notifications when saving/updating user enrollments. Not related to the digest_notification_ids parameter. Default: true",
      defaultValue: false,
    },
    trigger_certifications: {
      type: "boolean",
      label: "Trigger Certifications",
      description:
        "(optional) Trigger certifications generation when saving/updating user enrollments. Default: true",
      defaultValue: true,
    },
    assignment_type: {
      type: "string",
      label: "Assignment Type",
      description:
        "(optional) Assignment Type enrollment attribute. Can be passed only when the attribute is configured in the platform advanced settings. The possible values are 'mandatory', 'required', 'recommended', 'optional' but to be accepted they must be enabled in the settings. This parameter is optional. Can be mandatory, required, recommended or optional",
      defaultValue: "",
    },
    digest_notification_ids: {
      type: "array",
      label: "Digest Notification IDs",
      description:
        "(optional) Ids of notifications to trigger. This option is not related to the trigger_notifications parameter",
      defaultValue: [],
    },
    additional_field_category_validation: {
      type: "boolean",
      label: "Additional Field Category Validation",
      description:
        "(optional) If set to false, it skips category validation of additional fields incompatible with the course category and does not set them on the resulting enrollment. Default - 'true'",
      defaultValue: true,
    },
  },
};
