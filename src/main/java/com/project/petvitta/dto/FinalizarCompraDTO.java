package com.project.petvitta.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class FinalizarCompraDTO {

    private Long enderecoId;

    private Long enderecoTemporarioId;

    private List<Long> itensSelecionados;

    private List<Long> cuponsIds;

    private List<CartaoPagamentoDTO> cartoes;

    private Long cartaoTemporarioId;

    private BigDecimal valorCartaoTemporario;
}