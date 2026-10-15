package com.project.petvitta.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SolicitarTrocaDTO {
    private Long pedidoId;

    private List<ItemTrocaDTO> itens;

    @NotNull(message = "O motivo da troca é obrigatório.")
    private Long motivoTroca;

    @Size(min = 1, max = 500, message = "A justificativa deve ter entre 1 e 500 caracteres.")
    private String justificativaTroca;
}
