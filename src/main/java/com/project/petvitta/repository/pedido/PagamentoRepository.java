package com.project.petvitta.repository.pedido;

import com.project.petvitta.model.pedido.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findAllByOrderByIdAsc();
}