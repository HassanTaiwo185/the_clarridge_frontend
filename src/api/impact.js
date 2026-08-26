import api from "./axios";

export const getImpactStats = () => api.get("/impact/");
export const updateImpactStats = (data) => api.patch("/impact/", data);