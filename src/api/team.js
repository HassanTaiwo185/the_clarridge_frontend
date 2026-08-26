import api from "./axios";

export const getTeamMembers = () => api.get("/users/team-members/");