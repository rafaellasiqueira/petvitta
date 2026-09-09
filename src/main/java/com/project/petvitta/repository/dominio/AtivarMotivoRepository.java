package com.project.petvitta.repository.dominio;

import com.project.petvitta.model.dominio.AtivarMotivo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AtivarMotivoRepository
        extends JpaRepository<AtivarMotivo, Long> {
    List<AtivarMotivo> findAllByOrderByIdAsc();
}