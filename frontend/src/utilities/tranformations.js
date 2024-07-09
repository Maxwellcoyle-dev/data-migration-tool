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
    default:
      throw new Error(`Unknown import type: ${importType}`);
  }
};
