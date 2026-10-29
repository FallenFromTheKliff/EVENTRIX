package com.example.demo.services;

import com.example.demo.model.BookingStatus;
import com.example.demo.model.EventImage;
import com.example.demo.model.EventStatus;
import com.example.demo.model.User;
import com.example.demo.model.Events.Event;
import com.example.demo.model.Events.EventLike;
import com.example.demo.model.Events.TicketType;
import com.example.demo.model.dto.EventResponseDTO;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired private EventRepo eventRepository;
    @Autowired private EventLikeRepo eventLikeRepository;
    @Autowired private UserRepo userRepository;
    @Autowired private EventImageRepo eventImageRepository;
    @Autowired private BookingRepo bookingRepository;

    public List<EventResponseDTO> getEvents(String status, String category, String title, LocalDateTime startDate, LocalDateTime endDate, String userEmail) {
        List<Event> events = eventRepository.findEventsWithFilters(category, title, startDate, endDate).stream()
                .filter(event -> status == null || event.getStatus().name().equals(status))
                .collect(Collectors.toList());
        return mapEventsToDTOs(events, userEmail);
    }

    public List<EventResponseDTO> getActiveEvents(String category, String title, LocalDateTime startDate, LocalDateTime endDate, String userEmail) {
        return getEvents("ACTIVE", category, title, startDate, endDate, userEmail);
    }

    public List<EventResponseDTO> getLikedEvents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapEventsToDTOs(eventRepository.findLikedEventsByUserId(user.getUserId()), userEmail);
    }

    public EventResponseDTO getEventById(Long eventId, String userEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return mapEventsToDTOs(Collections.singletonList(event), userEmail).get(0);
    }

    private List<EventResponseDTO> mapEventsToDTOs(List<Event> events, String userEmail) {
        if (events.isEmpty()) {
            return Collections.emptyList();
        }
        Set<Long> likedEventIds = Collections.emptySet();
        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<Long> eventIds = events.stream().map(Event::getEventId).collect(Collectors.toList());
            likedEventIds = eventLikeRepository.findLikedEventIdsByUserId(user.getUserId(), eventIds);
        }
        final Set<Long> finalLikedEventIds = likedEventIds;
        return events.stream().map(event -> EventResponseDTO.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .description(event.getDescription())
                .dateTime(event.getDateTime())
                .location(event.getLocation())
                .price(event.getPrice())
                .thumbnailUrl(event.getImageUrl())
                .category(event.getCategory())
                .previewImages(event.getPreviewImages())
                .ticketTypes(event.getTicketTypes())
                .likeCount(eventLikeRepository.countByEventEventId(event.getEventId()))
                .isLiked(finalLikedEventIds.contains(event.getEventId()))
                .totalTickets(event.getTotalTickets())
                .availableTickets(event.getAvailableTickets())
                .doorsOpen(event.getDoorsOpen())
                .showTime(event.getShowTime())
                .status(event.getStatus())
                .build()).collect(Collectors.toList());
    }

    public Event saveEvent(Event event) {
        checkVenue(event, null);
        if (event.getPreviewImages().size() > 4) throw new RuntimeException("An event can only have up to 4 images");
        event.getTicketTypes().forEach(ticketType -> ticketType.setEvent(event));
        event.getPreviewImages().forEach(image -> image.setEvent(event));
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(long id, Event eventDetails) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        checkVenue(eventDetails, id);
        int sold = event.getTotalTickets() - event.getAvailableTickets();
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setDateTime(eventDetails.getDateTime());
        event.setLocation(eventDetails.getLocation());
        event.setPrice(eventDetails.getPrice());
        event.setTotalTickets(eventDetails.getTotalTickets());
        event.setAvailableTickets(Math.max(0, eventDetails.getTotalTickets() - sold));
        event.setDoorsOpen(eventDetails.getDoorsOpen());
        event.setShowTime(eventDetails.getShowTime());
        event.setCategory(eventDetails.getCategory());
        event.setImageUrl(eventDetails.getImageUrl());
        syncTicketTypes(event, eventDetails.getTicketTypes());
        syncPreviewImages(event, eventDetails.getPreviewImages());
        Event saved = eventRepository.save(event);
        if (eventDetails.getStatus() != null && eventDetails.getStatus() != saved.getStatus()) {
            return eventDetails.getStatus() == EventStatus.ARCHIVED ? archiveEvent(id) : unarchiveEvent(id);
        }
        return saved;
    }

    private void syncTicketTypes(Event event, List<TicketType> incoming) {
        Set<Long> keptIds = incoming.stream().map(TicketType::getId).filter(Objects::nonNull).collect(Collectors.toSet());
        event.getTicketTypes().removeIf(existing -> !keptIds.contains(existing.getId()));
        for (TicketType details : incoming) {
            if (details.getId() == null) {
                details.setEvent(event);
                event.getTicketTypes().add(details);
            } else {
                event.getTicketTypes().stream()
                        .filter(existing -> existing.getId().equals(details.getId()))
                        .findFirst()
                        .ifPresent(existing -> {
                            existing.setName(details.getName());
                            existing.setPrice(details.getPrice());
                            existing.setAvailableQuantity(details.getAvailableQuantity());
                            existing.setDescription(details.getDescription());
                        });
            }
        }
    }

    private void syncPreviewImages(Event event, List<EventImage> incoming) {
        if (incoming.size() > 4) throw new RuntimeException("An event can only have up to 4 images");
        Set<Long> keptIds = incoming.stream().map(EventImage::getId).filter(Objects::nonNull).collect(Collectors.toSet());
        event.getPreviewImages().removeIf(existing -> !keptIds.contains(existing.getId()));
        for (EventImage details : incoming) {
            if (details.getId() == null) {
                details.setEvent(event);
                event.getPreviewImages().add(details);
            }
        }
    }

    public List<LocalDate> getVenueDates(String location, Long excludeId) {
        return eventRepository.findVenueDates(location.trim(), excludeId == null ? -1L : excludeId).stream()
                .map(LocalDateTime::toLocalDate)
                .distinct()
                .collect(Collectors.toList());
    }

    private void checkVenue(Event event, Long excludeId) {
        LocalDate date = event.getDateTime().toLocalDate();
        boolean taken = getVenueDates(event.getLocation(), excludeId).stream()
                .anyMatch(booked -> Math.abs(ChronoUnit.DAYS.between(booked, date)) <= 1);
        if (taken) throw new RuntimeException("This location is unavailable on or beside that date");
    }

    public void deleteEvent(long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (event.getStatus() != EventStatus.ARCHIVED) {
            throw new RuntimeException("Only archived events can be deleted");
        }
        eventRepository.delete(event);
    }

    @Transactional
    public Event archiveEvent(long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(EventStatus.ARCHIVED);
        event.setAvailableTickets(0);
        return eventRepository.save(event);
    }

    @Transactional
    public Event unarchiveEvent(long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(EventStatus.ACTIVE);
        int bookedTickets = event.getBookings().stream()
                .filter(b -> b.getStatus() == BookingStatus.PAID)
                .mapToInt(b -> b.getQuantity())
                .sum();
        event.setAvailableTickets(event.getTotalTickets() - bookedTickets);
        return eventRepository.save(event);
    }

    @Transactional
    public String toggleLike(long eventId, String userEmail) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<EventLike> existing = eventLikeRepository.findByUserUserIdAndEventEventId(user.getUserId(), eventId);
        if (existing.isPresent()) {
            eventLikeRepository.delete(existing.get());
            return "UNLIKED";
        }
        eventLikeRepository.save(EventLike.builder().event(event).user(user).build());
        return "LIKED";
    }

    public EventImage addPreviewImage(long eventId, String imageUrl, String caption) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        EventImage image = EventImage.builder()
                .event(event)
                .imageUrl(imageUrl)
                .caption(caption)
                .build();
        return eventImageRepository.save(image);
    }

    public void deletePreviewImage(long imageId) {
        if (!eventImageRepository.existsById(imageId)) {
            throw new RuntimeException("Image not found");
        }
        eventImageRepository.deleteById(imageId);
    }
}