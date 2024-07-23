import { courses } from "./types/courses";
import { enrollments } from "./types/enrollments";
import { catalogs } from "./types/catalogs";
import { branches } from "./types/branches";
import { groups } from "./types/groups";

const types = (type) => {
  switch (type) {
    case "courses":
      return courses;
    case "enrollments":
      return enrollments;
    case "catalogs":
      return catalogs;
    case "branches":
      return branches;
    case "groups":
      return groups;
    default:
      return {};
  }
};

export default types;
