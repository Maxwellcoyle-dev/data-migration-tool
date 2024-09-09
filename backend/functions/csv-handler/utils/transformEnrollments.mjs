const transformEnrollments = (data) => {
  const transformedData = data.map((row) => {
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

  console.log("enrollmentData", transformedData);
  return { transformedData, batchCount: 300 };
};

export default transformEnrollments;
