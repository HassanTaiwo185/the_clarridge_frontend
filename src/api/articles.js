import api from "./axios";

export const getArticles = () => api.get("/articles/");
export const createArticle = (formData) =>
  api.post("/articles/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateArticle = (slug, formData) =>
  api.patch(`/articles/${slug}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteArticle = (slug) => api.delete(`/articles/${slug}/`);