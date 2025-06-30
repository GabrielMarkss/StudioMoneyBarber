package com.stmoneybarber.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.stmoneybarber.backend.model.Notificacao;
import com.stmoneybarber.backend.repository.NotificacaoRepository;

@Service
public class NotificacaoService {
    @Autowired
    private NotificacaoRepository repo;

    public Notificacao criar(Notificacao notificacao) {
        return repo.save(notificacao);
    }

    public List<Notificacao> listarTodas() {
        return repo.findAll(Sort.by(Sort.Direction.DESC, "dataCriacao"));
    }

    public void deletarParaTodos(Long id) {
        repo.deleteById(id);
    }

    public boolean existePorId(Long id) {
        return repo.existsById(id);
    }

}
