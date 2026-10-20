package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.model.Events.Event;
import com.example.demo.model.Events.EventComment;
import com.example.demo.model.Events.EventLike;
import com.example.demo.model.Events.TicketType;
import com.example.demo.model.dto.CommentRequestDTO;
import com.example.demo.model.dto.EventResponseDTO;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.model.EventImage;
import com.example.demo.model.EventStatus;
import com.example.demo.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired private EventRepo eventRepository;
    @Autowired private EventLikeRepo eventLikeRepository;
    @Autowired private EventCommentRepo eventCommentRepository;
    @Autowired private UserRepo userRepository;
    @Autowired private TicketTypeRepo ticketTypeRepository;
    @Autowired private EventImageRepo eventImageRepository; // NEW
    @Autowired private BookingRepo bookingRepository; // NEW

    // REFACTORED: Main method to get events with filtering and user-specific like status.
    public List<EventResponseDTO> getEvents(String status, String category, String title, LocalDateTime startDate, LocalDateTime endDate, String userEmail) {
        List<Event> events = eventRepository.findEventsWithFilters(category, title, startDate, endDate).stream()
                .filter(event -> status == null || event.getStatus().name().equals(status))
                .collect(Collectors.toList());
        return mapEventsToDTOs(events, userEmail);
    }

    public List<EventResponseDTO> getActiveEvents(String category, String title, LocalDateTime startDate, LocalDateTime endDate, String userEmail) {
        return getEvents("ACTIVE", category, title, startDate, endDate, userEmail);
    }

    // NEW: Get events a user has liked.
    public List<EventResponseDTO> getLikedEvents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Event> events = eventRepository.findLikedEventsByUserId(user.getUserId());
        return mapEventsToDTOs(events, userEmail);
    }

    public EventResponseDTO getEventById(Long eventId, String userEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return mapEventsToDTOs(Collections.singletonList(event), userEmail).get(0);
    }

    // Helper to convert Event entities to DTOs, including 'isLiked' status.
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

    // --- Admin Methods ---

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

    // REFACTORED: Now checks for ARCHIVED status before deleting.
    public void deleteEvent(long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (event.getStatus() != EventStatus.ARCHIVED) {
            throw new RuntimeException("Only archived events can be deleted");
        }
        eventRepository.delete(event);
    }

    // NEW: Archive an event
    @Transactional
    public Event archiveEvent(long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(EventStatus.ARCHIVED);
        event.setAvailableTickets(0); // Set tickets to zero as per requirement
        return eventRepository.save(event);
    }

    // NEW: Unarchive an event
    @Transactional
    public Event unarchiveEvent(long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(EventStatus.ACTIVE);
        // You might want to restore available tickets based on bookings, or just set back to total.
        // For simplicity, let's recalculate from total tickets minus booked tickets.
        int bookedTickets = event.getBookings().stream()
                .filter(b -> b.getStatus() == BookingStatus.PAID)
                .mapToInt(b -> b.getQuantity())
                .sum();
        event.setAvailableTickets(event.getTotalTickets() - bookedTickets);
        return eventRepository.save(event);
    }

    // --- User Interaction Methods ---

    @Transactional
    public String toggleLike(long eventId, String userEmail) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        Optional<EventLike> existing = eventLikeRepository.findByUserUserIdAndEventEventId(user.getUserId(), eventId);
        if (existing.isPresent()) {
            eventLikeRepository.delete(existing.get());
            return "UNLIKED";
        } else {
            EventLike like = EventLike.builder().event(event).user(user).build();
            eventLikeRepository.save(like);
            return "LIKED";
        }
    }

    @Transactional
    public EventComment addComment(long eventId, String userEmail, CommentRequestDTO dto) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        // NEW: Validation - User must have a completed booking for this event.
        boolean hasCompletedBooking = bookingRepository.existsByUserAndEventAndStatus(user, event, BookingStatus.COMPLETED);
        if (!hasCompletedBooking) {
            throw new RuntimeException("You can only comment on events you have a completed booking for.");
        }

        EventComment comment = new EventComment();
        comment.setEvent(event);
        comment.setUser(user);
        comment.setContent(dto.getContent());
        comment.setRating(dto.getRating());
        comment.setCreatedAt(LocalDateTime.now());
        return eventCommentRepository.save(comment);
    }

    public List<EventComment> getComments(long eventId) {
        return eventCommentRepository.findByEventEventIdOrderByCreatedAtDesc(eventId);
    }

    // --- Ticket Type & Image Management ---
    public List<TicketType> getTicketTypes(long eventId) {
        return ticketTypeRepository.findByEventEventId(eventId);
    }
    public TicketType addTicketType(long eventId, TicketType ticketType) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        ticketType.setEvent(event);
        return ticketTypeRepository.save(ticketType);
    }
    public TicketType updateTicketType(long id, TicketType details) {
        TicketType tt = ticketTypeRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket type not found"));
        tt.setName(details.getName());
        tt.setPrice(details.getPrice());
        tt.setAvailableQuantity(details.getAvailableQuantity());
        tt.setDescription(details.getDescription());
        return ticketTypeRepository.save(tt);
    }
    public void deleteTicketType(long id) {
        ticketTypeRepository.deleteById(id);
    }

    // NEW: Add a preview image to an event.
    public EventImage addPreviewImage(long eventId, String imageUrl, String caption) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        EventImage image = EventImage.builder()
                .event(event)
                .imageUrl(imageUrl)
                .caption(caption)
                .build();
        return eventImageRepository.save(image);
    }

    // NEW: Delete a preview image.
    public void deletePreviewImage(long imageId) {
        if (!eventImageRepository.existsById(imageId)) {
            throw new RuntimeException("Image not found");
        }
        eventImageRepository.deleteById(imageId);
    }
}