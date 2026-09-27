package com.project.petvitta.repository.dominio;

import com.project.petvitta.model.dominio.Especie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EspecieRepository extends JpaRepository<Especie, Long> {
}
