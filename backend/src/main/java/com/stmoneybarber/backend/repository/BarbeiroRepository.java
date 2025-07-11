package com.stmoneybarber.backend.repository;

import com.stmoneybarber.backend.model.Barbeiro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {
}
