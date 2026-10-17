package com.project.petvitta.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RetornoEstoqueDTO {

    private Long trocaId;
    private List<ItemRetornoEstoqueDTO> itens;
    private boolean retornarEstoque;
}