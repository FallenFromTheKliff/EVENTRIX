package com.example.demo.repository;

import com.example.demo.model.Events.Trait;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TraitRepo extends JpaRepository<Trait, Long> {}
