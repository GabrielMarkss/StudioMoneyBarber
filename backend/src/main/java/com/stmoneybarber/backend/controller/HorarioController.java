package com.stmoneybarber.backend.controller;

import com.stmoneybarber.backend.model.Horario;
import com.stmoneybarber.backend.service.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Horario criarOuAtualizar(@RequestBody Horario horario) {
        return horarioService.criarOuAtualizar(horario);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        horarioService.deletar(id);
    }

    @PostMapping("/bloquear-dia")
    public void bloquearDia(@RequestParam String dia) {
        horarioService.bloquearTodosHorariosDoDia(dia);
    }

    @GetMapping("/id/{id}")
    public Horario buscarPorId(@PathVariable Long id) {
        return horarioService.buscarPorId(id).orElse(null);
    }
}
