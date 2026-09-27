package com.project.petvitta.repository.cliente;

import com.project.petvitta.model.cliente.Cartao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartaoRepository extends JpaRepository<Cartao, Long> {
}