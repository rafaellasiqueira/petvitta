package com.project.petvitta.service.cliente;

import com.project.petvitta.model.cliente.Notificacao;
import com.project.petvitta.repository.cliente.NotificacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    public List<Notificacao> buscarPorClienteId(Long clienteId) {
        return notificacaoRepository.findByClienteId(clienteId);
    }

    public boolean temNotificacaoNaoLida(Long clienteId) {
        return notificacaoRepository.existsByClienteIdAndLidaFalse(clienteId);
    }

    public void marcarComoLida(Long id) {
        Notificacao notificacao = notificacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Notificação não encontrada."
                ));

        notificacao.setLida(true);

        notificacaoRepository.save(notificacao);
    }
}