package com.project.petvitta.repository.treinamento;

import com.project.petvitta.model.treinamento.ModeloVersao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ModeloVersaoRepository extends JpaRepository<ModeloVersao, Long> {

    Optional<ModeloVersao> findTopByOrderByIdDesc();
}
