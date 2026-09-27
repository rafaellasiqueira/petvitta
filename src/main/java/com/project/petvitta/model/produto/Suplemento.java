package com.project.petvitta.model.produto;

import com.project.petvitta.model.dominio.FormaApresentacao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "suplemento")
@PrimaryKeyJoinColumn(name = "produto_id")
@Getter
@Setter
public class Suplemento extends Produto {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forma_apresentacao_id", nullable = false)
    private FormaApresentacao formaApresentacao;

    public Suplemento() {
    }
}