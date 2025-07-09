package com.stmoneybarber.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.stmoneybarber.backend.model.Card;
import com.stmoneybarber.backend.repository.CardRepository;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardRepository repository;

    @GetMapping
    public List<Card> listar() {
        return repository.findAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> criar(
            @RequestParam("descricao") String descricao,
            @RequestParam("imagem") MultipartFile imagem,
            @RequestHeader("X-Admin") boolean isAdmin) throws IOException {

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas administradores podem criar cards.");
        }

        byte[] bytes = imagem.getBytes();
        String base64 = Base64.getEncoder().encodeToString(bytes);
        String imagemBase64 = "data:" + imagem.getContentType() + ";base64," + base64;

        Card card = new Card();
        card.setDescricao(descricao);
        card.setImagemPath(imagemBase64);
        repository.save(card);

        return ResponseEntity.ok(card);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestParam("descricao") String descricao,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem,
            @RequestHeader("X-Admin") boolean isAdmin) throws IOException {

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas administradores podem editar cards.");
        }

        return repository.findById(id).map(card -> {
            card.setDescricao(descricao);
            try {
                if (imagem != null && !imagem.isEmpty()) {
                    byte[] bytes = imagem.getBytes();
                    String base64 = Base64.getEncoder().encodeToString(bytes);
                    String imagemBase64 = "data:" + imagem.getContentType() + ";base64," + base64;
                    card.setImagemPath(imagemBase64);
                }
                repository.save(card);
                return ResponseEntity.ok(card);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar a imagem.");
            }
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Card não encontrado"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(
            @PathVariable Long id,
            @RequestHeader("X-Admin") boolean isAdmin) {

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas administradores podem deletar cards.");
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
