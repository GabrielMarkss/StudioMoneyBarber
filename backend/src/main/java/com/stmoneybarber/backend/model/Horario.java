package com.stmoneybarber.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hora; // formato: "11:00", "11:30", etc.

    private boolean bloqueado = false; // se true, o horário está indisponível
}
