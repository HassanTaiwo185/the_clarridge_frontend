import api from "./axios";

export const getProgrammes = () => api.get("/programmes/");

export const getProgramme = (slug) => api.get(`/programmes/${slug}/`);

export const createProgramme = (formData) =>
  api.post("/programmes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProgramme = (slug, formData) =>
  api.patch(`/programmes/${slug}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProgramme = (slug) => api.delete(`/programmes/${slug}/`);