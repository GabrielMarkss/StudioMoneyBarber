package com.stmoneybarber.backend.controller;

import java.util.Base64;
import java.util.List;

import com.stmoneybarber.backend.model.Imagem;
import com.stmoneybarber.backend.repository.ImagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/imagens")
public class ImagemController {

    @Autowired
    private ImagemRepository imagemRepository;

    @GetMapping
    public List<Imagem> listar() {
        return imagemRepository.findAll();
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Imagem> criar(@RequestParam("imagem") MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            String url = "data:" + file.getContentType() + ";base64," + base64;

            Imagem imagem = new Imagem();
            imagem.setUrl(url);

            return ResponseEntity.ok(imagemRepository.save(imagem));
        } catch (Exception e) {
            e.printStackTrace(); // <<<<<< ADICIONE PARA VER ERRO NO LOG
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!imagemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        imagemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Imagem> atualizar(@PathVariable Long id, @RequestBody Imagem novaImagem) {
        return imagemRepository.findById(id).map(imagem -> {
            imagem.setUrl(novaImagem.getUrl());
            return ResponseEntity.ok(imagemRepository.save(imagem));
        }).orElse(ResponseEntity.notFound().build());
    }
}
