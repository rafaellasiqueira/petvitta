package com.project.petvitta.model.troca;

import com.project.petvitta.model.pedido.ItemPedido;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "item_troca")
@Getter
@Setter
public class ItemTroca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private boolean voltarEstoque = false;

    @ManyToOne
    @JoinColumn(name = "troca_id", nullable = false)
    private Troca troca;

    @ManyToOne
    @JoinColumn(name = "item_pedido_id", nullable = false)
    private ItemPedido itemPedido;

    public ItemTroca() {
    }
}