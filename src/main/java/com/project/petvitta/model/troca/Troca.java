package com.project.petvitta.model.troca;

import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.cliente.Notificacao;
import com.project.petvitta.model.dominio.MotivoTroca;
import com.project.petvitta.model.dominio.StatusPedido;
import com.project.petvitta.model.dominio.StatusTroca;
import com.project.petvitta.model.pedido.Pedido;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Troca")
@Getter
@Setter
public class Troca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 6, updatable = false)
    private String codigo;

    @Column(nullable = false)
    private LocalDateTime dataSolicitacao;

    @Column
    private LocalDateTime dataAprovacao;

    @Column
    private LocalDateTime dataReprovacao;

    @Column
    private LocalDateTime dataEnviado;

    @Column
    private LocalDateTime dataRecebido;

    @Column
    private LocalDateTime dataTrocado;

    @Column(nullable = false, length = 500)
    private String justificativaTroca;

    @OneToMany(mappedBy = "troca",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<ItemTroca> itens = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motivo_troca_id")
    private MotivoTroca motivoTroca;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "status_troca_id")
    private StatusTroca statusTroca;

    @OneToMany(mappedBy = "troca",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Notificacao> notificacoes = new ArrayList<>();


    public List<String> getProximosStatus() {
        List<String> status = new ArrayList<>();

        if (statusTroca.getDescricao().equals("Em troca")) {
            status.add("Troca Autorizada");
            status.add("Troca Recusada");
        }

        if (statusTroca.getDescricao().equals("Item Enviado")) {
            status.add("Item Recebido");
        }

        if (statusTroca.getDescricao().equals("Item Recebido")) {
            status.add("Trocado");
        }

        return status;
    }

    public Troca() {
    }
}
