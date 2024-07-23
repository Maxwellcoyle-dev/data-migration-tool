import catalogResponseMap from "./response-maps/catalogResponseMap.mjs";
import courseResponseMap from "./response-maps/courseResponseMap.mjs";
import branchResponseMap from "./response-maps/branchResponseMap.mjs";
import enrollmentResponseMap from "./response-maps/enrollmentResponseMap.mjs";
// import groupResponseMap from "./response-maps/groupResponseMap.mjs";

const importTypes = {
  catalogs: {
    endpoint: "/learn/v1/catalog/batch",
    method: "POST",
    responseMapFunction: catalogResponseMap,
  },
  courses: {
    endpoint: "/learn/v1/courses/batch",
    method: "POST",
    responseMapFunction: courseResponseMap,
  },
  branches: {
    endpoint: "/manage/v1/orgchart/batch",
    method: "POST",
    responseMapFunction: branchResponseMap,
  },
  enrollments: {
    endpoint: "/learn/v1/enrollment/batch",
    method: "POST",
    responseMapFunction: enrollmentResponseMap,
  },
  groups: {
    endpoint: "/audiences/v1/audience",
    method: "POST",
    // responseMapFunction: groupResponseMap,
  },
};

export default importTypes;
