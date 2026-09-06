package com.project.petvitta.repository.dominio;

import com.project.petvitta.model.dominio.TipoLogradouro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TipoLogradouroRepository extends JpaRepository<TipoLogradouro, Long> {

    List<TipoLogradouro> findAllByOrderByIdAsc();
}
