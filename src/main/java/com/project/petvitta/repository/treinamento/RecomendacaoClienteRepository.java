package com.project.petvitta.repository.treinamento;

import com.project.petvitta.model.treinamento.RecomendacaoCliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecomendacaoClienteRepository extends JpaRepository<RecomendacaoCliente, Long> {

    List<RecomendacaoCliente> findByModeloVersaoIdAndClienteIdOrderByScoreDesc(Long modeloVersaoId, Long clienteId);
}
