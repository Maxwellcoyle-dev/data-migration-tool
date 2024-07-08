export const transformCourses = (data) => {
  const courseData = data.map((row) => {
    return {
      course_type: row.course_type,
      course_name: row.course_name,
      course_description: row.course_description,
      // only include field if it exists, if it doesn't exist, set do not add the field at all
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
