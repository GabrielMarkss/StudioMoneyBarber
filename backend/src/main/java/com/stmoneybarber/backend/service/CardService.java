package com.stmoneybarber.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stmoneybarber.backend.model.Card;
import com.stmoneybarber.backend.repository.CardRepository;

@Service
public class CardService {

    @Autowired
    private CardRepository repository;

    public List<Card> listarTodos() {
        return repository.findAll();
    }

    public Optional<Card> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Card salvar(Card card) {
        return repository.save(card);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
