package com.project.petvitta.model.produto;

import com.project.petvitta.model.dominio.TipoRacao;
import com.project.petvitta.model.dominio.TamanhoGrao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "racao")
@PrimaryKeyJoinColumn(name = "produto_id")
@DiscriminatorValue("RACAO")
@Getter
@Setter
public class Racao extends Produto {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_racao_id", nullable = false)
    private TipoRacao tipoRacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tamanho_grao_id", nullable = false)
    private TamanhoGrao tamanhoGrao;

    public Racao() {
    }
}