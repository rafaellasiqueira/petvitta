package com.project.petvitta.model.produto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "variacao_produto")
@Getter
@Setter
public class VariacaoProduto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal peso;

    @Column(nullable = false)
    private BigDecimal valorCusto;

    @Column(nullable = false)
    private BigDecimal valorVenda;

    @Column(nullable = false)
    private Integer estoqueAtual;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    public VariacaoProduto() {
    }
}
