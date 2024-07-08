import axiosInstance from "./axiosInstance";

export const createGroups = async (formData) => {
  const response = await axiosInstance.post(`/create-groups/`, formData);
  return response;
};

export const createCourses = async (formData) => {
  const response = await axiosInstance.post(`/create-courses/`, formData);
  return response;
};

export const createBranches = async (formData) => {
  const response = await axiosInstance.post(`/create-branches/`, formData);
  console.log("response", response);
  return response;
};
