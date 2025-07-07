package com.stmoneybarber.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stmoneybarber.backend.model.Imagem;
import com.stmoneybarber.backend.repository.ImagemRepository;

@RestController
@RequestMapping("/api/imagens")
public class ImagemController {

    @Autowired
    private ImagemRepository imagemRepository;

    @GetMapping
    public List<Imagem> listar() {
        return imagemRepository.findAll();
    }

    @PostMapping
    public Imagem criar(@RequestBody Imagem imagem) {
        return imagemRepository.save(imagem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Imagem> atualizar(@PathVariable Long id, @RequestBody Imagem novaImagem) {
        return imagemRepository.findById(id)
                .map(imagem -> {
                    imagem.setUrl(novaImagem.getUrl());
                    return ResponseEntity.ok(imagemRepository.save(imagem));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!imagemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        imagemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
