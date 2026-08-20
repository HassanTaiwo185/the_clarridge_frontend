import api from "./axios";

export const registerUser = (data) => {
  return api.post("/users/register/", data);
};

export const verifyEmail = (data) => {
  return api.post("/users/verify-email/", data);
};

export const loginUser = (data) => {
  return api.post("/token/", data);
};