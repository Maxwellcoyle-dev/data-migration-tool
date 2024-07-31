import { courses } from "./types/courses";
import { enrollments } from "./types/enrollments";
import { catalogs } from "./types/catalogs";
import { branches } from "./types/branches";
import { groups } from "./types/groups";
import { learningObjects } from "./types/learningObjects";
import { catalogItems } from "./types/catalogItems";

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
    case "learning_objects":
      return learningObjects;
    case "catalog_items":
      return catalogItems;
    default:
      return {};
  }
};

export default types;
