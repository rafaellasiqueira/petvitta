package com.project.petvitta.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class HistoricoCompraDTO {

    private String codigoPedido;
    private String data;
    private String status;
    private List<String> produtos;

    public HistoricoCompraDTO(String codigo, String string, String descricao, List<String> produtos) {
    }
}
