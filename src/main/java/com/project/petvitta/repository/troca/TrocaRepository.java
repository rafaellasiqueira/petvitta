package com.project.petvitta.repository.troca;

import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.model.troca.Troca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrocaRepository extends JpaRepository<Troca, Long> {
    List<Troca> findByClienteId(Long clienteId);
    List<Troca> findAllByOrderByIdDesc();
}
