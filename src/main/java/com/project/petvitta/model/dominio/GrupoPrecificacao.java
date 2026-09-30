package com.project.petvitta.model.dominio;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Id;

import java.math.BigDecimal;

@Entity
@Table(name = "grupo_precificacao")
@Getter
@Setter
public class GrupoPrecificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nome;

    @Column(nullable = false)
    private BigDecimal percentual;

    public GrupoPrecificacao() {
    }
}