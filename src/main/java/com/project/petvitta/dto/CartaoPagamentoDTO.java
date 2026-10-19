package com.project.petvitta.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CartaoPagamentoDTO {
    private Long cartaoId;
    private Long cartaoTemporarioId;
    private BigDecimal valor;
}
