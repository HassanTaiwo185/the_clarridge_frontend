import api from "./axios";

export const getPublicCalendarEvents = () => api.get("/calendar/");