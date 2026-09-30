package com.project.petvitta.model.dominio;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Id;

@Entity
@Table(name = "faixa_etaria")
@Getter
@Setter
public class FaixaEtaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 8)
    private String nome;

    public FaixaEtaria() {
    }
}