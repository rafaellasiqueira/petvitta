package com.project.petvitta.repository.dominio;

import com.project.petvitta.model.dominio.StatusTroca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusTrocaRepository extends JpaRepository<StatusTroca, Long> {
    Optional<StatusTroca> findByDescricao(String descricao);
}
