package com.project.petvitta.service;

import com.project.petvitta.model.cliente.Cliente;
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

    public void criarNotificacao(
            Cliente cliente,
            String titulo,
            String mensagem
    ) {

        Notificacao notificacao = new Notificacao();

        notificacao.setCliente(cliente);
        notificacao.setTitulo(titulo);
        notificacao.setMensagem(mensagem);

        notificacaoRepository.save(notificacao);
    }

    public List<Notificacao> buscarPorCliente(Long clienteId) {

        return notificacaoRepository.findByClienteId(clienteId);
    }
}