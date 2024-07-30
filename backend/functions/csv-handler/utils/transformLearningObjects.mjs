const transformLearningObjectData = (data) => {
  const transformedData = data.map((row) => {
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

  console.log("learningObjectData", transformedData);
  return { transformedData, batchCount: 20 };
};

export default transformLearningObjectData;
