package com.stmoneybarber.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.stmoneybarber.backend.model.Card;
import com.stmoneybarber.backend.repository.CardRepository;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/cards")
// @CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CardController {

    @Autowired
    private CardRepository repository;

    private final String uploadDir = "uploads/";

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

        String fileName = System.currentTimeMillis() + "_" + imagem.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, imagem.getBytes());

        Card card = new Card();
        card.setDescricao(descricao);
        card.setImagemPath("/api/cards/imagem/" + fileName);
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

        Card card = repository.findById(id).orElseThrow();
        card.setDescricao(descricao);

        if (imagem != null && !imagem.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + imagem.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, imagem.getBytes());
            card.setImagemPath("/api/cards/imagem/" + fileName);
        }

        repository.save(card);

        return ResponseEntity.ok(card);
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

    @GetMapping("/imagem/{filename:.+}")
    public ResponseEntity<Resource> servirImagem(@PathVariable String filename) throws IOException {
        Path file = Paths.get(uploadDir).resolve(filename);
        Resource resource = new UrlResource(file.toUri());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
