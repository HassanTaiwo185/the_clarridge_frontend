import api from "./axios";

export const getTestimonials = () => api.get("/testimonials/");
export const updateTestimonialStatus = (id, status) =>
  api.patch(`/testimonials/${id}/`, { status });
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}/`);