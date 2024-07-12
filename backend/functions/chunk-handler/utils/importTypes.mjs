import catalogResponseMap from "./response-maps/catalogResponseMap.mjs";
import courseResponseMap from "./response-maps/courseResponseMap.mjs";
import branchResponseMap from "./response-maps/branchResponseMap.mjs";
import enrollmentResponseMap from "./response-maps/enrollmentResponseMap.mjs";
import groupResponseMap from "./response-maps/groupResponseMap.mjs";

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
    endpoint: "/learn/v1/branches/batch",
    method: "POST",
    responseMapFunction: branchResponseMap,
  },
  enrollments: {
    endpoint: "/learn/v1/enrollments/batch",
    method: "POST",
    responseMapFunction: enrollmentResponseMap,
  },
  groups: {
    endpoint: "/learn/v1/groups/batch",
    method: "POST",
    responseMapFunction: groupResponseMap,
  },
};

export default importTypes;
