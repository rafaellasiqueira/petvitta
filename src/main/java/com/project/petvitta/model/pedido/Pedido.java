package com.project.petvitta.model.pedido;

import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.model.cliente.Endereco;
import com.project.petvitta.model.dominio.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedido")
@Getter
@Setter
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 6, updatable = false)
    private String codigo;

    @Column(nullable = false)
    private LocalDateTime data;

    @Column
    private LocalDateTime dataAprovacao;

    @Column
    private LocalDateTime dataEntrega;

    @Column
    private LocalDateTime dataPrevisaoEntrega;

    @Column
    private LocalDateTime dataCancelamento;

    @Column
    private LocalDateTime dataReprovacaoPagamento;

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(nullable = false)
    private BigDecimal frete;

    @Column(nullable = false)
    private BigDecimal desconto;

    @Column(nullable = false)
    private BigDecimal total;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "endereco_id", nullable = false)
    private Endereco endereco;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "status_pedido_id")
    private StatusPedido statusPedido;

    @ManyToMany
    @JoinTable(
            name = "pedido_cupom",
            joinColumns = @JoinColumn(name = "pedido_id"),
            inverseJoinColumns = @JoinColumn(name = "cupom_id")
    )
    private List<Cupom> cupons;

    public int getQuantidadeTotal() {
        int quantidade = 0;

        for (int i = 0; i < itens.size(); i++) {
            quantidade += itens.get(i).getQuantidade();
        }

        return quantidade;


    }

    public List<String> getProximosStatus() {
        List<String> status = new ArrayList<>();

        if (statusPedido.getDescricao().equals("Em processamento")) {
            status.add("Aprovada");
            status.add("Reprovada");
        }

        if (statusPedido.getDescricao().equals("Aprovada")) {
            status.add("Em transporte");
        }

        if (statusPedido.getDescricao().equals("Em transporte")) {
            status.add("Entregue");
        }

        return status;
    }
}