package com.stmoneybarber.backend.repository;

import com.stmoneybarber.backend.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
}
