package com.project.petvitta.model.pedido;

import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.dominio.Estado;
import com.project.petvitta.model.dominio.TipoEndereco;
import com.project.petvitta.model.dominio.TipoLogradouro;
import com.project.petvitta.model.dominio.TipoResidencia;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "endereco_compra")
@Getter
@Setter
public class EnderecoTemporario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String nomeIdentificacao;

    @Column(nullable = false, length = 9)
    private String cep;

    @Column(nullable = false, length = 150)
    private String logradouro;

    @Column(nullable = false, length = 150)
    private String bairro;

    @Column(nullable = false, length = 20)
    private String numero;

    @Column(nullable = false, length = 150)
    private String cidade;

    @Column(nullable = false, length = 50)
    private String pais;

    @Column(length = 500)
    private String observacoes;

    @Column(nullable = false)
    private boolean utilizado;

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

    public EnderecoTemporario() {
    }
}
