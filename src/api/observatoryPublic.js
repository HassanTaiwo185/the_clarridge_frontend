import api from "./axios";

export const getObservatoryPost = (slug) => api.get(`/observatory/${slug}/`);