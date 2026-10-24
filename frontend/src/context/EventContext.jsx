import { createContext, useContext, useState, useEffect } from "react";

import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

import { toSlug } from "../utils/events";
import { emptyEventFilters, months } from "../utils/filters";
import useDebouncing from "../utils/useDebouncing";

const EventContext = createContext();

const toBody = (data) => ({ ...data, doorsOpen: data.doorsOpen || null });
const toUrl = (user) => user.role === "ADMIN" ? "/admin/events" : "/events";
const toParams = ({ name, category, date, status }) => {
  const { startDate, endDate } = months.find((month) => month.value === date) ?? {};
  return { name: name.trim() || undefined, category: category || undefined, status: status || undefined, startDate, endDate };
};

export function EventProvider({ children }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(emptyEventFilters);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const debouncedFilters = useDebouncing(filters);

  useEffect(() => {
    if (!user) return;
    axiosClient.get("/events/categories").then((response) => setCategories(response.data));
    return () => {
      setEvents([]);
      setCategories([]);
      setFilters(emptyEventFilters)
      setFavoritesOnly(false);
      setEventsLoading(true);
      setEventsError(null);
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let active = true;
    setEventsLoading(true);
    setEventsError(null);

    axiosClient.get(toUrl(user), { params: toParams(debouncedFilters) })
      .then((response) => {
        if (active) setEvents(response.data);
      })
      .catch(() => {
        if (active) setEventsError("Oops, we couldn't load the events...");
      })
      .finally(() => {
        if (active) setEventsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, debouncedFilters]);

  const refreshEvents = async () => {
    setEventsLoading(true);
    setEventsError(null);

    try {
      setEvents((await axiosClient.get(toUrl(user), { params: toParams(filters) })).data);
    } catch {
      setEventsError("Oops, we couldn't load the events...");
    } finally {
      setEventsLoading(false);
    }
  };
  const getEvent = (slug) => events.find((event) => toSlug(event.title) === slug);
  const getEventById = async (id) => (await axiosClient.get(`/events/${id}`)).data;
  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const mutator = async (request) => {
    await request;
    await refreshEvents();
  };

  const toggleFavorite = async (id) => {
    const response = await axiosClient.post(`/user/events/${id}/like`);
    const liked = response.data === "LIKED";
    setEvents((current) => current.map((event) => event.eventId === id ? { ...event, liked, likeCount: event.likeCount + (liked ? 1 : -1) } : event));
  };
  const toggleFavoritesOnly = () => setFavoritesOnly(!favoritesOnly);
  const addComment = async (id, data) => (await axiosClient.post(`/user/events/${id}/comments`, data)).data;
  const getVenueDates = async (location, excludeId) => (await axiosClient.get("/admin/events/venue-dates", { params: { location, excludeId } })).data;

  const createEvent = (data) => mutator(axiosClient.post("/admin/events/create", data));
  const updateEvent = (id, data) => mutator(axiosClient.put(`/admin/events/${id}`, data));
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
      events: favoritesOnly ? events.filter((event) => event.liked) : events,
      categories,
      filters,
      handleFilter,
      getEvent,
      getEventById,
      eventsLoading,
      eventsError,
      refreshEvents,
      ...(user?.role === "ADMIN"
        ? { createEvent, updateEvent, deleteEvent, archiveEvent, unarchiveEvent, addImage, deleteImage, getVenueDates }
        : { favoritesOnly, toggleFavoritesOnly, toggleFavorite, addComment })
    }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => useContext(EventContext);