import api from "./axios";

export const getApplications = () => api.get("/applications/");
export const getApplication = (id) => api.get(`/applications/${id}/`);
export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/`, { status });
export const updateApplication = (id, formData) =>
  api.patch(`/applications/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteApplication = (id) => api.delete(`/applications/${id}/`);