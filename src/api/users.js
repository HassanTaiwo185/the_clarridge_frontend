import api from "./axios";

export const getAllUsers = () => api.get("/users/admin/all-users/");
export const approveUser = (user_id) => api.post("/users/admin/approve-user/", { user_id });
export const promoteToAdmin = (user_id) => api.post("/users/admin/promote-admin/", { user_id });