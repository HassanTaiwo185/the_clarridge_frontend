import api from "./axios";

export const getMyProfile = () => api.get("/users/me/");
export const updateMyProfile = (formData) =>
  api.patch("/users/me/update/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const changeMyPassword = (data) => api.post("/users/change-password/", data);
export const logoutUser = (refreshToken) => api.post("/users/logout/", { refresh: refreshToken });