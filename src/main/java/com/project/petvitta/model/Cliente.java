package com.project.petvitta.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "cliente")
@Getter
@Setter

public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 6, updatable = false)
    private String codigo;

    @Column(nullable = false, length = 150)
    @NotBlank(message = "O nome é obrigatório.")
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @Column(nullable = false)
    @NotBlank(message = "O Tipo de telefone é obrigatório")
    private String tipoTelefone;

    @Column(nullable = false, length = 15)
    @NotBlank(message = "O telefone é obrigatório")
    private String telefone;

    @Column(nullable = false)
    @NotBlank(message = "O gênero é obrigatório")
    private String genero;

    @Column(nullable = false)
    @NotNull(message = "A data de nascimento é obrigatória")
    @Past(message = "A data de nascimento deve ser anterior à data atual.")
    private LocalDate dataNascimento;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Informe um e-mail válido")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "A senha é obrigatório")
    private String senha;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(nullable = false)
    private Integer ranking = 0;

    // Um cliente pode ter vários endereços
    @OneToMany(
            mappedBy = "cliente",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Endereco> enderecos = new ArrayList<>();

    // Um cliente pode ter vários cartões
    @OneToMany(
            mappedBy = "cliente",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Cartao> cartoes = new ArrayList<>();

    // Construtor vazio necessário para o JPA
    public Cliente() {
    }
}

