package com.stmoneybarber.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.stmoneybarber.backend.model.Card;

public interface CardRepository extends JpaRepository<Card, Long> {
}
