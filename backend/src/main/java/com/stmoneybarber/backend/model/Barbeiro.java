package com.stmoneybarber.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Barbeiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150) // nome costuma ser curto, pode manter
    private String nome;

    @Column(length = 150)
    private String instagram;

    @Column(length = 20)
    private String telefone;

    @Column(columnDefinition = "TEXT") // URLs podem ser longas, melhor TEXT
    private String linkAgendamento;

    @Column(columnDefinition = "TEXT") // URLs de imagens podem ser longas, melhor TEXT
    private String imagemUrl;
}
