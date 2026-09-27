package com.project.petvitta.model.produto;

import com.project.petvitta.model.dominio.TipoPetisco;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "petisco")
@PrimaryKeyJoinColumn(name = "produto_id")
@Getter
@Setter
public class Petisco extends Produto {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_petisco_id", nullable = false)
    private TipoPetisco tipoPetisco;

    public Petisco() {
    }
}