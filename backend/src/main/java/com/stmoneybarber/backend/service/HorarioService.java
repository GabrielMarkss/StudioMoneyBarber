package com.stmoneybarber.backend.service;

import com.stmoneybarber.backend.model.Horario;
import com.stmoneybarber.backend.repository.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HorarioService {

    @Autowired
    private HorarioRepository repository;

    public List<Horario> listarTodos() {
        return repository.findAll();
    }

    public Horario criar(Horario horario) {
        return repository.save(horario);
    }

    public Optional<Horario> editar(Long id, Horario horarioAtualizado) {
        return repository.findById(id).map(horario -> {
            horario.setHora(horarioAtualizado.getHora());
            return repository.save(horario);
        });
    }

    public boolean deletar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Horario> bloquearOuDesbloquear(Long id, boolean bloquear) {
        return repository.findById(id).map(horario -> {
            horario.setBloqueado(bloquear);
            return repository.save(horario);
        });
    }
}
