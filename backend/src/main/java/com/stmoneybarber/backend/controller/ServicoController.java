package com.stmoneybarber.backend.controller;

import com.stmoneybarber.backend.model.Servico;
import com.stmoneybarber.backend.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    @Autowired
    private ServicoRepository servicoRepository;

    @GetMapping
    public List<Servico> listar() {
        return servicoRepository.findAll();
    }

    @PostMapping
    public Servico adicionar(@RequestBody Servico servico) {
        return servicoRepository.save(servico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servico> atualizar(@PathVariable Long id, @RequestBody Servico servicoAtualizado) {
        return servicoRepository.findById(id)
                .map(servico -> {
                    servico.setNome(servicoAtualizado.getNome());
                    servico.setPreco(servicoAtualizado.getPreco());
                    return ResponseEntity.ok(servicoRepository.save(servico));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return servicoRepository.findById(id)
                .map(servico -> {
                    servicoRepository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
