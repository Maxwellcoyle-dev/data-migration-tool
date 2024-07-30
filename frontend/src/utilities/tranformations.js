const transformGroupData = (data) => {
  const groupData = data.map((row) => {
    return {
      name: row.name,
      description: row.description,
    };
  });
  console.log("groupData", groupData);
  return groupData;
};

const transformCatalogData = (data) => {
  const catalogData = data.map((row) => {
    return {
      code: row.code,
      name: row.name,
      ...(row.description && { description: row.description }),
    };
  });
  console.log("catalogData", catalogData);
  return catalogData;
};

const transformBranchData = (data) => {
  const branchData = data.map((row) => {
    const translations = {};
    // Loop over each property in the row
    for (const key in row) {
      // Check if the key starts with 'name_' which indicates a translation
      if (key.startsWith("name_")) {
        // Extract the language code after 'name_'
        const languageCode = key.split("_")[1];
        // Map the translation using the language code as the key
        translations[languageCode] = row[key];
      }
    }
    // Return the transformed object for each row
    return {
      code: row.code,
      translations: translations,
      ...(row.parent_code && { parent_code: row.parent_code }),
      ...(row.sibling && { sibling: row.sibling }),
    };
  });

  console.log("branchData", branchData);
  return branchData;
};

const transformEnrollmentData = (data) => {
  const enrollmentData = data.map((row) => {
    return {
      ...(row.user_id && { user_id: row.user_id }),
      ...(row.username && { username: row.username }),
      ...(row.course_id && { course_id: row.course_id }),
      ...(row.course_code && { course_code: row.course_code }),
      ...(row.session_code && { session_code: row.session_code }),
      ...(row.session_id && { session_id: row.session_id }),
      ...(row.level && { level: row.level }),
      ...(row.status && { status: row.status }),
      ...(row.enrollment_date && { enrollment_date: row.enrollment_date }),
      ...(row.completion_date && { completion_date: row.completion_date }),
      ...(row.active_from && { active_from: row.active_from }),
      ...(row.active_until && { active_until: row.active_until }),
      ...(row.score && { score: row.score }),
      ...(row.subscription_code && {
        subscription_code: row.subscription_code,
      }),
      ...(row.evaluation_text && { evaluation_text: row.evaluation_text }),
      ...(row.evaluation_date && { evaluation_date: row.evaluation_date }),
      ...(row.evaluation_score && { evaluation_score: row.evaluation_score }),
      ...(row.passed && { passed: row.passed }),
      ...(row.present && { present: row.present }),
      ...(row.timezone && { timezone: row.timezone }),
      ...(row.batch_item_id && { batch_item_id: row.batch_item_id }),
      ...(row.dates && { dates: row.dates }),
      ...(row.assignment_type && { assignment_type: row.assignment_type }),
    };
  });

  console.log("enrollmentData", enrollmentData);
  return enrollmentData;
};

const transformCourseData = (data) => {
  const courseData = data.map((row) => {
    return {
      course_type: row.course_type,
      course_name: row.course_name,
      course_description: row.course_description,
      ...(row.course_code && { course_code: row.course_code }),
      ...(row.course_provider && { course_provider: row.course_provider }),
      ...(row.external_course_id && {
        external_course_id: row.external_course_id,
      }),
      ...(row.course_cover && { course_cover: row.course_cover }),
      ...(row.course_cover_id && { course_cover_id: row.course_cover_id }),
      ...(row.course_cover_name && {
        course_cover_name: row.course_cover_name,
      }),
      ...(row.course_language && { course_language: row.course_language }),
      ...(row.course_published && { course_published: row.course_published }),
      ...(row.course_category_id && {
        course_category_id: row.course_category_id,
      }),
      ...(row.course_category && { course_category: row.course_category }),
      ...(row.course_difficulty && {
        course_difficulty: row.course_difficulty,
      }),
      ...(row.user_enroll && { user_enroll: row.user_enroll }),
      ...(row.user_enroll_begin && {
        user_enroll_begin: row.user_enroll_begin,
      }),
      ...(row.user_enroll_end && { user_enroll_end: row.user_enroll_end }),
      ...(row.course_avg_time && { course_avg_time: row.course_avg_time }),
      ...(row.course_for_sale && { course_for_sale: row.course_for_sale }),
      ...(row.course_price && { course_price: row.course_price }),
      ...(row.course_status && { course_status: row.course_status }),
      ...(row.course_credits && { course_credits: row.course_credits }),
      ...(row.course_max_subscriptions && {
        course_max_subscriptions: row.course_max_subscriptions,
      }),
      ...(row.course_validity_begin && {
        course_validity_begin: row.course_validity_begin,
      }),
      ...(row.course_validity_end && {
        course_validity_end: row.course_validity_end,
      }),
      ...(row.batch_item_id && { batch_item_id: row.batch_item_id }),
      ...(row.content_partner_code && {
        content_partner_code: row.content_partner_code,
      }),
      ...(row.affiliate_price && { affiliate_price: row.affiliate_price }),
      ...(row.content_partner_fields && {
        content_partner_fields: row.content_partner_fields,
      }),
      ...(row.decommissioning && { decommissioning: row.decommissioning }),
    };
  });

  console.log("courseData", courseData);
  return courseData;
};

const transformLearningObjectData = (data) => {
  const learningObjectData = data.map((row) => {
    return {
      ...(row.course_code && { course_code: row.course_code }),
      ...(row.course_id && { course_id: row.course_id }),
      ...(row.lo_name && { lo_name: row.lo_name }),
      ...(row.lo_type && { lo_type: row.lo_type }),
      ...(row.lo_code && { lo_code: row.lo_code }),
      ...(row.lo_filename && { lo_filename: row.lo_filename }),
      ...(row.lo_url && { lo_url: row.lo_url }),
      ...(row.lo_description && { lo_description: row.lo_description }),
      ...(row.lo_thumbnail && { lo_thumbnail: row.lo_thumbnail }),
      ...(row.lo_content && { lo_content: row.lo_content }),
      ...(row.mobile_use_external_link !== undefined && {
        mobile_use_external_link: row.mobile_use_external_link,
      }),
      ...(row.lo_tincan_salt && { lo_tincan_salt: row.lo_tincan_salt }),
      ...(row.lo_oauth_client && { lo_oauth_client: row.lo_oauth_client }),
      ...(row.lo_enable_oauth !== undefined && {
        lo_enable_oauth: row.lo_enable_oauth,
      }),
      ...(row.lo_external_source_url && {
        lo_external_source_url: row.lo_external_source_url,
      }),
      ...(row.lo_track_all_activities !== undefined && {
        lo_track_all_activities: row.lo_track_all_activities,
      }),
      ...(row.launch_mode && { launch_mode: row.launch_mode }),
    };
  });

  console.log("learningObjectData", learningObjectData);
  return learningObjectData;
};

export const transformData = (data, importType) => {
  switch (importType) {
    case "branches":
      return transformBranchData(data);
    case "courses":
      return transformCourseData(data);
    case "groups":
      return transformGroupData(data);
    case "catalogs":
      return transformCatalogData(data);
    case "enrollments":
      return transformEnrollmentData(data);
    case "learning_objects":
      return transformLearningObjectData(data);
    default:
      throw new Error(`Unknown import type: ${importType}`);
  }
};
