package com.project.petvitta.repository.dominio;

import com.project.petvitta.model.dominio.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusPedidoRepository extends JpaRepository<StatusPedido, Long> {
    Optional<StatusPedido> findByDescricao(String descricao);
}
