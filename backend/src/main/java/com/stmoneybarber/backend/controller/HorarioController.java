package com.stmoneybarber.backend.controller;

import com.stmoneybarber.backend.dto.DiaBloqueioRequest;
import com.stmoneybarber.backend.dto.HorarioDTO;
import com.stmoneybarber.backend.model.Horario;
import com.stmoneybarber.backend.service.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @GetMapping
    public List<Horario> listarTodos() {
        return horarioService.listarTodos();
    }

    @GetMapping("/dia/{dia}")
    public List<Horario> listarPorDia(@PathVariable String dia) {
        return horarioService.listarPorDiaSemana(dia);
    }

    @PostMapping
    public Horario criarOuAtualizar(@RequestBody HorarioDTO dto) {
        return horarioService.salvarDto(dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        horarioService.deletar(id);
    }

    @PostMapping("/bloquear-dia")
    public ResponseEntity<?> bloquearOuDesbloquearDia(@RequestBody DiaBloqueioRequest request) {
        if (request.isBloquear()) {
            horarioService.bloquearTodosHorariosDoDia(request.getDiaSemana());
        } else {
            horarioService.desbloquearTodosHorariosDoDia(request.getDiaSemana());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/id/{id}")
    public Horario buscarPorId(@PathVariable Long id) {
        return horarioService.buscarPorId(id).orElse(null);
    }
}
