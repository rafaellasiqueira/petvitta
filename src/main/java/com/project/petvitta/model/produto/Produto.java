package com.project.petvitta.model.produto;

import com.project.petvitta.model.dominio.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produto")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_produto")
@Getter
@Setter
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 6)
    private String codigoProduto;

    @Column(nullable = false, unique = true, length = 13)
    private String codigoBarras;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 100)
    private String marca;

    @Column(nullable = false, length = 2000)
    private String descricao;

    @Column(nullable = false, length = 2048)
    private String imagemUrl;

    @Column(nullable = false, length = 10000)
    private String composicaoNutricional;

    @Column(nullable = false)
    private boolean contemTransgenico;

    @Column(nullable = false)
    private boolean contemGluten;

    @Column(nullable = false)
    private boolean ativo;

    @ManyToMany
    @JoinTable(
            name = "produto_especie",
            joinColumns = @JoinColumn(name = "produto_id"),
            inverseJoinColumns = @JoinColumn(name = "especie_id")
    )
    private List<Especie> especies = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "produto_porte",
            joinColumns = @JoinColumn(name = "produto_id"),
            inverseJoinColumns = @JoinColumn(name = "porte_id")
    )
    private List<Porte> portes = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "produto_faixa_etaria",
            joinColumns = @JoinColumn(name = "produto_id"),
            inverseJoinColumns = @JoinColumn(name = "faixa_etaria_id")
    )
    private List<FaixaEtaria> faixasEtarias = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "produto_sabor",
            joinColumns = @JoinColumn(name = "produto_id"),
            inverseJoinColumns = @JoinColumn(name = "sabor_id")
    )
    private List<Sabor> sabores = new ArrayList<>();

    @OneToMany(
            mappedBy = "produto",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<QuantidadeRecomendada> quantidadeRecomendada = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "grupo_precificacao_id",
            nullable = false)
    private GrupoPrecificacao grupoPrecificacao;

    @OneToMany(mappedBy = "produto",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<VariacaoProduto> variacoes = new ArrayList<>();

    public String getCategoria() {
        if (this instanceof Racao) {
            return "Ração";
        }

        if (this instanceof Suplemento) {
            return "Suplemento";
        }

        if (this instanceof Petisco) {
            return "Petisco";
        }

        return "Outro";
    }

    public BigDecimal getValorMaximo() {
        BigDecimal maior = null;

        for (int i = 0; i < variacoes.size(); i++) {
            BigDecimal valor = variacoes.get(i).getValorVenda();

            if (valor != null && (maior == null || valor.compareTo(maior) > 0)) {
                maior = valor;
            }
        }

        return maior;
    }

    public BigDecimal getValorMinimo() {
        BigDecimal menor = null;

        for (int i = 0; i < variacoes.size(); i++) {
            BigDecimal valor = variacoes.get(i).getValorVenda();

            if (valor != null && (menor == null || valor.compareTo(menor) < 0)) {
                menor = valor;
            }
        }

        return menor;
    }

    public Produto() {
    }
}