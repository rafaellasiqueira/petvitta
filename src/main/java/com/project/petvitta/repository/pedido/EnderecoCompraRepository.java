package com.project.petvitta.repository.pedido;

import com.project.petvitta.model.pedido.EnderecoCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnderecoCompraRepository extends JpaRepository<EnderecoCompra, Long> {
    List<EnderecoCompra> findByClienteIdAndUtilizadoFalse(Long clienteId);
}

