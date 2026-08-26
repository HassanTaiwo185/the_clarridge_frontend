import api from "./axios";

export const getObservatoryPosts = () => api.get("/observatory/");
export const createObservatoryPost = (formData) =>
  api.post("/observatory/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateObservatoryPost = (slug, formData) =>
  api.patch(`/observatory/${slug}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteObservatoryPost = (slug) => api.delete(`/observatory/${slug}/`);