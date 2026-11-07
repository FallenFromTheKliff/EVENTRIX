const minute = 60000;
const hour = 60 * minute;
const day = 24 * hour;
const toLocal = (date) => new Date(date.getTime() - date.getTimezoneOffset() * minute).toISOString().slice(0, 16);

export const today = () => toLocal(new Date()).slice(0, 10);
export const toDate = (value, dateStyle = "full") => new Date(value).toLocaleDateString("en-US", { dateStyle });
export const toTime = (value) => value ? new Date(value).toLocaleTimeString("en-US", { timeStyle: "short" }) : "TBA";
export const isUpcoming = (value) => new Date(value) > new Date();
export const dateInPast = (dateTime, showTime) => Boolean(dateTime) && new Date(`${dateTime}T${showTime || "23:59"}`) < new Date();
export const doorsOpenAt = (dateTime, showTime) => dateTime && showTime ? toLocal(new Date(new Date(`${dateTime}T${showTime}`).getTime() - 2 * hour)) : "";
export const dateTaken = (dateTime, takenDates = []) => Boolean(dateTime) && takenDates.some((taken) => Math.abs(new Date(dateTime) - new Date(taken)) <= day);