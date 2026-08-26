import api from "./axios";

export const getPublicArticles = () => api.get("/articles/");
export const getPublicArticle = (slug) => api.get(`/articles/${slug}/`);