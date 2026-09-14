package com.project.petvitta.model;

import com.project.petvitta.model.dominio.BandeiraCartao;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cartao")
@Getter
@Setter
public class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 19)
    private String numero;

    @Column(nullable = false, length = 150)
    private String nomeImpresso;

    @Column(nullable = false, length = 4)
    private String codigoSeguranca;

    @Column(nullable = false)
    private boolean preferencial = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bandeira_id", nullable = false)
    private BandeiraCartao bandeira;

    public Cartao() {
    }
}