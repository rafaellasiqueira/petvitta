package com.project.petvitta.service;

import com.project.petvitta.model.Auditoria;
import com.project.petvitta.repository.AuditoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    public AuditoriaService(AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    public void registrar(String usuario, String operacao, String dadosAlterados) {

        Auditoria auditoria = new Auditoria();

        auditoria.setDataHora(LocalDateTime.now());
        auditoria.setUsuario(usuario);
        auditoria.setOperacao(operacao);
        auditoria.setDadosAlterados(dadosAlterados);

        auditoriaRepository.save(auditoria);
    }

    public List<Auditoria> listar() {
        return auditoriaRepository.findAll(Sort.by(Sort.Direction.DESC, "dataHora"));
    }
}
