package com.project.petvitta.dto;

import com.project.petvitta.model.Cartao;
import com.project.petvitta.model.Endereco;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ClienteCadastroDTO {

    private String nome;
    private String cpf;
    private String tipoTelefone;
    private String telefone;
    private String genero;
    private LocalDate dataNascimento;
    private String email;

    private String senha;
    private String confirmarSenha;

    private List<Endereco> enderecos;
    private List<Cartao> cartoes;
}
