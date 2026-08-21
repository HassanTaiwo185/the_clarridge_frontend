import api from "./axios";

export const getCollegiumMembers = () => api.get("/collegium/");
export const createCollegiumMember = (formData) =>
  api.post("/collegium/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateCollegiumMember = (id, formData) =>
  api.patch(`/collegium/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteCollegiumMember = (id) => api.delete(`/collegium/${id}/`);