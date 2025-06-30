package com.stmoneybarber.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stmoneybarber.backend.model.Notificacao;
import com.stmoneybarber.backend.service.NotificacaoService;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoService service;

    @PostMapping
    public ResponseEntity<Notificacao> criar(@RequestBody Notificacao notificacao) {
        return ResponseEntity.ok(service.criar(notificacao));
    }

    @GetMapping
    public ResponseEntity<List<Notificacao>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notificacao> editar(@PathVariable Long id,
            @RequestBody Notificacao notificacao,
            @RequestHeader("X-USER-ROLE") String role) {
        if (!role.equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(403).body(null);
        }

        if (!service.existePorId(id)) { // usar método do service para verificar existência
            return ResponseEntity.notFound().build();
        }

        notificacao.setId(id);
        return ResponseEntity.ok(service.criar(notificacao)); // 'criar' pode salvar update tb
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean confirmar,
            @RequestHeader("X-USER-ROLE") String role) {
        if (role.equalsIgnoreCase("ADMIN")) {
            if (!confirmar) {
                return ResponseEntity.badRequest().body("Confirmação obrigatória para admin.");
            }
            service.deletarParaTodos(id);
            return ResponseEntity.noContent().build();
        } else {
            // lógica futura para apagar somente para o usuário
            return ResponseEntity.status(403).body("Usuários normais não podem deletar globalmente.");
        }
    }

}
