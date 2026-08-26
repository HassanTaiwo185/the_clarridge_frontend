import api from "./axios";

export const getPublicProgrammes = () => api.get("/programmes/");