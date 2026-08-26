import api from "./axios";

export const getOpportunities = () => api.get("/opportunities/");
export const createOpportunity = (data) => api.post("/opportunities/", data);
export const updateOpportunity = (slug, data) => api.patch(`/opportunities/${slug}/`, data);
export const deleteOpportunity = (slug) => api.delete(`/opportunities/${slug}/`);