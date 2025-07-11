package com.stmoneybarber.backend.service;

import com.stmoneybarber.backend.model.Barbeiro;
import com.stmoneybarber.backend.repository.BarbeiroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BarbeiroService {

    @Autowired
    private BarbeiroRepository repository;

    public List<Barbeiro> listarTodos() {
        return repository.findAll();
    }

    public Barbeiro salvar(Barbeiro barbeiro) {
        return repository.save(barbeiro);
    }

    public Barbeiro atualizar(Long id, Barbeiro barbeiroAtualizado) {
        Barbeiro barbeiro = repository.findById(id).orElseThrow();

        barbeiro.setNome(barbeiroAtualizado.getNome());
        barbeiro.setInstagram(barbeiroAtualizado.getInstagram());
        barbeiro.setTelefone(barbeiroAtualizado.getTelefone());
        barbeiro.setLinkAgendamento(barbeiroAtualizado.getLinkAgendamento());
        barbeiro.setImagemUrl(barbeiroAtualizado.getImagemUrl());

        return repository.save(barbeiro);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
