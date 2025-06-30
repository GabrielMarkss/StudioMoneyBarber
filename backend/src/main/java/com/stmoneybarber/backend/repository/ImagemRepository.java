package com.stmoneybarber.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stmoneybarber.backend.model.Imagem;

public interface ImagemRepository extends JpaRepository<Imagem, Long> {
}
