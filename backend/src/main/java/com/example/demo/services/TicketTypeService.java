package com.example.demo.services;

import com.example.demo.model.Events.TicketType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.repository.TicketTypeRepo;

import java.util.List;

@Service
public class TicketTypeService {

    @Autowired
    private TicketTypeRepo ticketTypeRepository;

    public List<TicketType> getAll() {
        return ticketTypeRepository.findAll();
    }

    public TicketType getById(Long id) {
        return ticketTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket type not found"));
    }

    public TicketType save(TicketType ticketType) {
        return ticketTypeRepository.save(ticketType);
    }

    public void delete(Long id) {
        ticketTypeRepository.deleteById(id);
    }
}
