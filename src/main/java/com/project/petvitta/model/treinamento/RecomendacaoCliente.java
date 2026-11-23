package com.project.petvitta.model.treinamento;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "recomendacao_cliente")
public class RecomendacaoCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long modeloVersaoId;

    @Column(nullable = false)
    private Long clienteId;

    @Column(nullable = false)
    private Long produtoId;

    @Column(nullable = false)
    private double score;
}