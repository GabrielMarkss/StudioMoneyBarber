package com.stmoneybarber.backend.dto;

public class DiaBloqueioRequest {
    private String diaSemana;
    private boolean bloquear;

    public String getDiaSemana() {
        return diaSemana;
    }

    public boolean isBloquear() {
        return bloquear;
    }
}
