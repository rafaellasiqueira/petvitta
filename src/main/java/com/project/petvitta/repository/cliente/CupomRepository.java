package com.project.petvitta.repository.cliente;

import com.project.petvitta.model.cliente.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CupomRepository extends JpaRepository<Cupom, Long> {
    Optional<Cupom> findByCodigo(String codigo);
}
