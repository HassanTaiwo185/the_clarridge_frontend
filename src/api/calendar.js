import api from "./axios";

export const getCalendarEvents = () => api.get("/calendar/");
export const createCalendarEvent = (data) => api.post("/calendar/", data);
export const updateCalendarEvent = (id, data) => api.patch(`/calendar/${id}/`, data);
export const deleteCalendarEvent = (id) => api.delete(`/calendar/${id}/`);