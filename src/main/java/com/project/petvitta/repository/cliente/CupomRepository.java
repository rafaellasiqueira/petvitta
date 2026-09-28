package com.project.petvitta.repository.cliente;

import com.project.petvitta.model.cliente.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CupomRepository extends JpaRepository<Cupom, Long> {
}
