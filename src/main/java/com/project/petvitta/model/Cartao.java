package com.project.petvitta.model;

import com.project.petvitta.model.dominio.BandeiraCartao;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
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
    @NotBlank(message = "O número do cartão é obrigatório.")
    private String numero;

    @Column(nullable = false)
    @NotBlank(message = "O nome impresso no cartão é obrigatório.")
    private String nomeImpresso;

    @Column(nullable = false, length = 4)
    @NotBlank(message = "O código de segurança é obrigatório.")
    private String codigoSeguranca;

    @Column(nullable = false)
    private boolean preferencial = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bandeira_id", nullable = false)
    private BandeiraCartao bandeira;

    // Construtor vazio necessário para o JPA
    public Cartao() {
    }
}
