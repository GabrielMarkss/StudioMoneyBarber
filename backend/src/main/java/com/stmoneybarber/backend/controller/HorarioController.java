package com.stmoneybarber.backend.controller;

import com.stmoneybarber.backend.model.Horario;
import com.stmoneybarber.backend.service.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    @Autowired
    private HorarioService service;

    @Autowired
    private HorarioService horarioService;

    @GetMapping
    public List<Horario> listar() {
        return horarioService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Horario> criar(@RequestBody Horario horario) {
        return ResponseEntity.ok(service.criar(horario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody Horario horario) {
        return service.editar(id, horario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return service.deletar(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/bloquear")
    public ResponseEntity<?> bloquear(@PathVariable Long id) {
        return service.bloquearOuDesbloquear(id, true)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/desbloquear")
    public ResponseEntity<?> desbloquear(@PathVariable Long id) {
        return service.bloquearOuDesbloquear(id, false)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
