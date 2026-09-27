package com.project.petvitta.model.produto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "quantidade_recomendada")
@Getter
@Setter
public class QuantidadeRecomendada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String pesoAnimal;

    @Column(nullable = false, length = 50)
    private String quantidadeRecomendada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id",
            nullable = false)
    private Produto produto;

    public QuantidadeRecomendada() {
    }
}