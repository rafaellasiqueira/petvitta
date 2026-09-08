package com.project.petvitta.model;

import com.project.petvitta.model.dominio.Estado;
import com.project.petvitta.model.dominio.TipoEndereco;
import com.project.petvitta.model.dominio.TipoLogradouro;
import com.project.petvitta.model.dominio.TipoResidencia;
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
    @NotBlank(message = "A cidade é obrigatória.")
    private String cidade;

    @Column(nullable = false)
    @NotBlank(message = "O país é obrigatório.")
    private String pais;

    @Column(length = 500)
    private String observacoes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_endereco_id", nullable = false)
    private TipoEndereco tipoEndereco;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_residencia_id", nullable = false)
    private TipoResidencia tipoResidencia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_logradouro_id", nullable = false)
    private TipoLogradouro tipoLogradouro;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;

    // Construtor vazio necessário para o JPA
    public Endereco() {
    }

}