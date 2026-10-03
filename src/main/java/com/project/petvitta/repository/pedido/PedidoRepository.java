package com.project.petvitta.repository.pedido;

import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.pedido.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteId(Long clienteId);
    Optional<Pedido> findByCodigo(String codigo);
}