package com.project.petvitta.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "endereco")
@Getter
@Setter

public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "O nome de indentificação é obrigatório.")
    private String nomeIdentificacao;

    @Column(nullable = false)
    @NotBlank(message = "O tipo de endereço é obrigatório")
    private String tipoEndereco;

    @Column(nullable = false)
    @NotBlank(message = "O tipo de residência é obrigatório")
    private String tipoResidencia;

    @Column(nullable = false)
    @NotBlank(message = "O tipo de logradouro é obrigatório")
    private String tipoLogradouro;

    @Column(nullable = false, length = 9)
    @NotBlank(message = "O CEP é obrigatório.")
    private String cep;

    @Column(nullable = false)
    @NotBlank(message = "O logradouro é obrigatório.")
    private String logradouro;

    @Column(nullable = false)
    @NotBlank(message = "O bairro é obrigatório.")
    private String bairro;

    @Column(nullable = false)
    @NotBlank(message = "O número é obrigatório.")
    private String numero;

    @Column(nullable = false)
    @NotBlank(message = "O estado é obrigatório.")
    private String estado;

    @Column(nullable = false)
    @NotBlank(message = "A cidade é obrigatória.")
    private String cidade;

    @Column(nullable = false)
    @NotBlank(message = "O país é obrigatório.")
    private String pais;

    @Column(length = 500)
    private String observacoes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    
    // Construtor vazio necessário para o JPA
    public Endereco() {
    }

}