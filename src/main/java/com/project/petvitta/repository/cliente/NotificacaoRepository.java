package com.project.petvitta.repository.cliente;

import com.project.petvitta.model.cliente.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByClienteId(Long clienteId);
}