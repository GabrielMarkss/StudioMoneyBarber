package com.stmoneybarber.backend.repository;

import com.stmoneybarber.backend.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
}
