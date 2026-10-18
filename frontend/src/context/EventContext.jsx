import { createContext, useContext, useEffect, useState } from "react";

import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const EventContext = createContext();

export function EventProvider({ children }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    if (!user) return;
    axiosClient.get("/events").then((response) => setEvents(response.data));
    return () => {
      setEvents([]);
      setFavoritesOnly(false);
    };
  }, [user]);

  const fetchEvents = async (params) => {
    const response = await axiosClient.get("/events", { params });
    setEvents(response.data);
  };
  const getEvent = async (id) => (await axiosClient.get(`/events/${id}`)).data;

  const toggleFavorite = async (id) => {
    const response = await axiosClient.post(`/user/events/${id}/like`);
    const liked = response.data === "LIKED";
    setEvents((current) => current.map((event) => event.eventId === id ? { ...event, liked, likeCount: event.likeCount + (liked ? 1 : -1) } : event));
  };
  const toggleFavoritesOnly = async () => {
    const response = await axiosClient.get(favoritesOnly ? "/events" : "/events/favorites");
    setEvents(response.data);
    setFavoritesOnly(!favoritesOnly);
  };
  const addComment = async (id, data) => (await axiosClient.post(`/user/events/${id}/comments`, data)).data;

  const createEvent = async (data) => (await axiosClient.post("/admin/events/create", data)).data;
  const updateEvent = async (id, data) => (await axiosClient.put(`/admin/events/${id}`, data)).data;
  const deleteEvent = (id) => axiosClient.delete(`/admin/events/${id}`);
  const archiveEvent = async (id) => (await axiosClient.put(`/admin/events/${id}/archive`)).data;
  const unarchiveEvent = async (id) => (await axiosClient.put(`/admin/events/${id}/unarchive`)).data;
  const addImage = async (id, data) => (await axiosClient.post(`/admin/events/${id}/images`, data)).data;
  const deleteImage = (id) => axiosClient.delete(`/admin/images/${id}`);

  return (
    <EventContext.Provider value={{
      events,
      fetchEvents,
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