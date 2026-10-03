package com.project.petvitta.repository.pedido;

import com.project.petvitta.model.pedido.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
    List<ItemPedido> findAllByOrderByIdAsc();
}
