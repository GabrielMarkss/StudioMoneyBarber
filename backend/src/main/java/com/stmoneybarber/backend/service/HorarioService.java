package com.stmoneybarber.backend.service;

import com.stmoneybarber.backend.dto.HorarioDTO;
import com.stmoneybarber.backend.model.Horario;
import com.stmoneybarber.backend.repository.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    public List<Horario> listarTodos() {
        List<Horario> horarios = horarioRepository.findAll();
        LocalTime agora = LocalTime.now();
        DayOfWeek hoje = LocalDate.now().getDayOfWeek();

        for (Horario h : horarios) {
            if (h.getDiaSemana().equals(hoje) && h.getHorario().isBefore(agora)) {
                h.setBloqueado(true);
            }
        }
        return horarios;
    }

    public List<Horario> listarPorDiaSemana(String dia) {
        DayOfWeek diaSemana = traduzirDia(dia);
        return horarioRepository.findByDiaSemana(diaSemana);
    }

    public Horario criarOuAtualizar(Horario horario) {
        return horarioRepository.save(horario);
    }

    public Horario salvarDto(HorarioDTO dto) {
        Horario horario = new Horario();

        if (dto.id != null) {
            horario.setId(dto.id);
        }

        horario.setDiaSemana(traduzirDia(dto.diaSemana));
        horario.setHorario(LocalTime.parse(dto.horario));
        horario.setDisponivel(dto.disponivel);
        horario.setBloqueado(dto.bloqueado);

        return horarioRepository.save(horario);
    }

    public void bloquearTodosHorariosDoDia(String dia) {
        DayOfWeek diaSemana = traduzirDia(dia);
        List<Horario> horarios = horarioRepository.findByDiaSemana(diaSemana);
        for (Horario h : horarios) {
            h.setBloqueado(true);
        }
        horarioRepository.saveAll(horarios);
    }

    public void desbloquearTodosHorariosDoDia(String dia) {
        DayOfWeek diaSemana = traduzirDia(dia);

        // Regra: domingo só pode ser desbloqueado manualmente
        if (diaSemana == DayOfWeek.SUNDAY) {
            return; // evita desbloqueio automático
        }

        List<Horario> horarios = horarioRepository.findByDiaSemana(diaSemana);
        for (Horario h : horarios) {
            h.setBloqueado(false);
        }
        horarioRepository.saveAll(horarios);
    }

    @Scheduled(cron = "1 0 0 * * *") // Executa às 00:01 todos os dias
    public void desbloquearHorariosDoDia() {
        DayOfWeek hoje = LocalDate.now().getDayOfWeek();

        if (hoje == DayOfWeek.SUNDAY)
            return; // Domingo nunca é desbloqueado automaticamente

        List<Horario> horarios = horarioRepository.findByDiaSemana(hoje);
        for (Horario h : horarios) {
            h.setBloqueado(false);
        }
        horarioRepository.saveAll(horarios);
    }

    public boolean horarioJaPassou(Horario horario) {
        LocalTime agora = LocalTime.now();
        DayOfWeek hoje = DayOfWeek.from(LocalDate.now());
        return (horario.getDiaSemana().equals(hoje) && horario.getHorario().isBefore(agora));
    }

    public void deletar(Long id) {
        horarioRepository.deleteById(id);
    }

    public Optional<Horario> buscarPorId(Long id) {
        return horarioRepository.findById(id);
    }

    private DayOfWeek traduzirDia(String diaPtBr) {
        return switch (diaPtBr.toUpperCase()) {
            case "SEGUNDA" -> DayOfWeek.MONDAY;
            case "TERÇA" -> DayOfWeek.TUESDAY;
            case "QUARTA" -> DayOfWeek.WEDNESDAY;
            case "QUINTA" -> DayOfWeek.THURSDAY;
            case "SEXTA" -> DayOfWeek.FRIDAY;
            case "SÁBADO" -> DayOfWeek.SATURDAY;
            case "DOMINGO" -> DayOfWeek.SUNDAY;
            default -> throw new IllegalArgumentException("Dia inválido: " + diaPtBr);
        };
    }
}
