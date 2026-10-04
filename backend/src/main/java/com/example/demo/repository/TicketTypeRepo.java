// TicketTypeRepository.java
package com.example.demo.repository;

import com.example.demo.model.Events.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketTypeRepo extends JpaRepository<TicketType, Long> {
    List<TicketType> findByEventEventId(Long eventId);
}
