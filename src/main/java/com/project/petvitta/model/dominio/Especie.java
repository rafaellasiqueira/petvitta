package com.project.petvitta.model.dominio;

import jakarta.persistence.*;
import lombok.Setter;
import lombok.Getter;
import jakarta.persistence.Id;

@Entity
@Table(name = "especie")
@Getter
@Setter
public class Especie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    public Especie() {
    }
}