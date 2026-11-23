package com.project.petvitta.model.treinamento;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "modelo_versao")
public class ModeloVersao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataTreinamento;

    @Column
    private int qtdCompras;

    @Column
    private int qtdFeedbacks;

    @Column
    private int qtdFeedbacksNovos;

    @Column
    private int qtdRecomendacoes;
}