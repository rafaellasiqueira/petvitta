package com.project.petvitta.model.dominio;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "motivo_ativacao")
@Getter
@Setter
public class AtivarMotivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String descricao;

    public AtivarMotivo() {
    }
}