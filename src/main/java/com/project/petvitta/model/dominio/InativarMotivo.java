package com.project.petvitta.model.dominio;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "motivo_inativacao")
@Getter
@Setter
public class InativarMotivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String descricao;

    public InativarMotivo() {
    }
}