import api from "./axios";

export const submitTestimonial = (data) => api.post("/testimonials/", data);