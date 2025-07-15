package com.stmoneybarber.backend.service;

import com.stmoneybarber.backend.model.Horario;
import com.stmoneybarber.backend.repository.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Service
public class HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    public List<Horario> listarTodos() {
        return horarioRepository.findAll();
    }

    public List<Horario> listarPorDiaSemana(String dia) {
        return horarioRepository.findByDiaSemana(DayOfWeek.valueOf(dia.toUpperCase()));
    }

    public Horario criarOuAtualizar(Horario horario) {
        return horarioRepository.save(horario);
    }

    public void bloquearTodosHorariosDoDia(String dia) {
        DayOfWeek diaSemana = DayOfWeek.valueOf(dia.toUpperCase());
        List<Horario> horarios = horarioRepository.findByDiaSemana(diaSemana);
        for (Horario h : horarios) {
            h.setBloqueado(true);
        }
        horarioRepository.saveAll(horarios);
    }

    public void deletar(Long id) {
        horarioRepository.deleteById(id);
    }

    public Optional<Horario> buscarPorId(Long id) {
        return horarioRepository.findById(id);
    }
}
