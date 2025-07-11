package com.stmoneybarber.backend.controller;

import com.stmoneybarber.backend.model.Barbeiro;
import com.stmoneybarber.backend.service.BarbeiroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barbeiros")
public class BarbeiroController {

    @Autowired
    private BarbeiroService barbeiroService;

    @GetMapping
    public List<Barbeiro> listar() {
        return barbeiroService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Barbeiro> criar(@RequestBody Barbeiro barbeiro) {
        Barbeiro novo = barbeiroService.salvar(barbeiro);
        return ResponseEntity.ok(novo);
    }

    @PutMapping("/{id}")
    public Barbeiro atualizar(@PathVariable Long id, @RequestBody Barbeiro barbeiro) {
        return barbeiroService.atualizar(id, barbeiro);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        barbeiroService.deletar(id);
    }
}
