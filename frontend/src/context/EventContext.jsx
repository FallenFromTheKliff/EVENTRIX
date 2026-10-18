import { createContext, useContext, useEffect, useState } from "react";

import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

import { monthOf } from "../utils/filters";

const EventContext = createContext();

const emptyFilters = { name: "", category: "", date: "" };
const toBody = (data) => ({ ...data, doorsOpen: data.doorsOpen || null });

export function EventProvider({ children }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    if (!user) return;
    axiosClient.get("/events").then((response) => setEvents(response.data));
    return () => {
      setEvents([]);
      setFilters(emptyFilters);
      setFavoritesOnly(false);
    };
  }, [user]);

  const fetchEvents = async () => {
    const response = await axiosClient.get("/events");
    setEvents(response.data);
  };
  const getEvent = (id) => events.find((event) => event.eventId === Number(id));
  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const mutator = async (request) => {
    await request;
    await fetchEvents().catch(() => {});
  };

  const toggleFavorite = async (id) => {
    const response = await axiosClient.post(`/user/events/${id}/like`);
    const liked = response.data === "LIKED";
    setEvents((current) => current.map((event) => event.eventId === id ? { ...event, liked, likeCount: event.likeCount + (liked ? 1 : -1) } : event));
  };
  const toggleFavoritesOnly = () => setFavoritesOnly(!favoritesOnly);
  const addComment = async (id, data) => (await axiosClient.post(`/user/events/${id}/comments`, data)).data;

  const createEvent = (data) => mutator(axiosClient.post("/admin/events/create", toBody(data)));
  const updateEvent = (id, data) => mutator(axiosClient.put(`/admin/events/${id}`, toBody(data)));
  const deleteEvent = async (id) => {
    await axiosClient.put(`/admin/events/${id}/archive`);
    await mutator(axiosClient.delete(`/admin/events/${id}`));
  };
  const archiveEvent = (id) => mutator(axiosClient.put(`/admin/events/${id}/archive`));
  const unarchiveEvent = (id) => mutator(axiosClient.put(`/admin/events/${id}/unarchive`));
  const addImage = (id, data) => mutator(axiosClient.post(`/admin/events/${id}/images`, data));
  const deleteImage = (id) => mutator(axiosClient.delete(`/admin/images/${id}`));

  return (
    <EventContext.Provider value={{
      events: events.filter((event) => (
        (!favoritesOnly || event.liked) &&
        event.title.toLowerCase().includes(filters.name.trim().toLowerCase()) &&
        (!filters.category || event.category?.name === filters.category) &&
        (!filters.date || monthOf(event.dateTime) === filters.date)
      )),
      categories: [...new Set(events.map((event) => event.category?.name).filter(Boolean))],
      filters,
      handleFilter,
      getEvent,
      ...(user?.role === "ADMIN"
        ? { createEvent, updateEvent, deleteEvent, archiveEvent, unarchiveEvent, addImage, deleteImage }
        : { favoritesOnly, toggleFavoritesOnly, toggleFavorite, addComment })
    }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => useContext(EventContext);