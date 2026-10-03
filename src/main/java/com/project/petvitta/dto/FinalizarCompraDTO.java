package com.project.petvitta.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class FinalizarCompraDTO {

    private Long enderecoId;

    private List<Long> itensSelecionados;

    private List<Long> cuponsIds;

    private List<CartaoPagamentoDTO> cartoes;
}