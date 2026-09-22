package com.project.petvitta.model;

import com.project.petvitta.model.dominio.AtivarMotivo;
import com.project.petvitta.model.dominio.Genero;
import com.project.petvitta.model.dominio.InativarMotivo;
import com.project.petvitta.model.dominio.TipoTelefone;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
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
    private String nome;

    @Column(nullable = false, unique = true, length = 14, updatable = false)
    private String cpf;

    @Column(nullable = false, length = 15)
    private String telefone;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(nullable = false, length = 60)
    private String senha;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(nullable = false)
    private Integer ranking = 0;

    @Column(length = 500)
    private String justificativaInativacao;

    @Column(length = 500)
    private String justificativaAtivacao;

    @OneToMany(
            mappedBy = "cliente", /* Cliente controla */
            cascade = CascadeType.ALL,
            orphanRemoval = true /* Pode ser removido do banco */
    )
    private List<Endereco> enderecos = new ArrayList<>();

    @OneToMany(
            mappedBy = "cliente",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Cartao> cartoes = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_telefone_id", nullable = false)
    private TipoTelefone tipoTelefone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genero_id", nullable = false)
    private Genero genero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motivo_inativacao_id")
    private InativarMotivo motivoInativacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motivo_ativacao_id")
    private AtivarMotivo motivoAtivacao;

    public Cliente() {
    }
}