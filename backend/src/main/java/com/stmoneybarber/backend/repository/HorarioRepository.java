package com.stmoneybarber.backend.repository;

import com.stmoneybarber.backend.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByDiaSemana(DayOfWeek diaSemana);
}
