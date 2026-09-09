package com.project.petvitta.repository.dominio;

import com.project.petvitta.model.dominio.InativarMotivo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InativarMotivoRepository
        extends JpaRepository<InativarMotivo, Long> {
    List<InativarMotivo> findAllByOrderByIdAsc();
}