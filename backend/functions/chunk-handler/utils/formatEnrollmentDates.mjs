// Existing formatDateToYYYYMMDDHHMMSS function
function formatDateToYYYYMMDDHHMMSS(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to format dates in the enrollmentData array
export const formatEnrollmentsDates = (enrollmentData) => {
  console.log("formatEnrollmentsDates function initiated");
  console.log("enrollmentData", enrollmentData);

  // Possible fields that might contain dates
  const dateFields = [
    "enrollment_date",
    "completion_date",
    "active_from",
    "active_until",
  ];

  // Iterate over each enrollment object
  const formattedData = enrollmentData.map((enrollment) => {
    const updatedEnrollment = { ...enrollment }; // Create a shallow copy to avoid mutating the original object

    // Iterate over each possible date field
    dateFields.forEach((field) => {
      if (updatedEnrollment[field]) {
        const parsedDate = new Date(updatedEnrollment[field]);

        // Check if the parsed date is valid
        if (!isNaN(parsedDate.getTime())) {
          updatedEnrollment[field] = formatDateToYYYYMMDDHHMMSS(parsedDate);
        }
      }
    });

    return updatedEnrollment;
  });

  return formattedData;
};
