import api from "./axios";

export const getTeamMembers = () => api.get("/team/");
export const createTeamMember = (formData) =>
  api.post("/team/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateTeamMember = (id, formData) =>
  api.patch(`/team/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteTeamMember = (id) => api.delete(`/team/${id}/`);