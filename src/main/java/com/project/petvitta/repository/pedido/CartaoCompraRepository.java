package com.project.petvitta.repository.pedido;

import com.project.petvitta.model.pedido.CartaoCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartaoCompraRepository extends JpaRepository<CartaoCompra, Long> {
    List<CartaoCompra> findByClienteIdAndUtilizadoFalse(Long clienteId);
}
