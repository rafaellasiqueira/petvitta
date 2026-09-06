package com.project.petvitta.repository.dominio;

import com.project.petvitta.model.dominio.TipoResidencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TipoResidenciaRepository extends JpaRepository<TipoResidencia, Long> {

    List<TipoResidencia> findAllByOrderByIdAsc();
}