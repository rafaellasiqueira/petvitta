package com.project.petvitta.repository.dominio;

import com.project.petvitta.model.dominio.InativarMotivo;
import com.project.petvitta.model.dominio.MotivoTroca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface MotivoTrocaRepository extends JpaRepository<MotivoTroca, Long> {
    List<MotivoTroca> findAllByOrderByIdAsc();
}
