package com.project.petvitta.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ClienteCadastroDTO {

    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres.")
    private String nome;

    @NotBlank(message = "O CPF é obrigatório.")
    private String cpf;

    @NotNull(message = "O tipo de telefone é obrigatório.")
    private Long tipoTelefone;

    @NotBlank(message = "O telefone é obrigatório.")
    private String telefone;

    @NotNull(message = "O gênero é obrigatório.")
    private Long genero;

    @NotNull(message = "A data de nascimento é obrigatória.")
    @Past(message = "A data de nascimento deve ser anterior à data atual.")
    private LocalDate dataNascimento;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um e-mail válido.")
    @Size(max = 254, message = "O e-mail deve ter no máximo 254 caracteres.")
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 8, max = 100, message = "A senha deve ter entre 8 e 100 caracteres.")
    @Pattern(regexp = "^$|.*[A-Z].*", message = "A senha deve ter pelo menos uma letra maiúscula.")
    @Pattern(regexp = "^$|.*[a-z].*", message = "A senha deve ter pelo menos uma letra minúscula.")
    @Pattern(regexp = "^$|.*[^A-Za-z0-9].*", message = "A senha deve ter pelo menos um caractere especial.")
    private String senha;

    @NotBlank(message = "A confirmação de senha é obrigatória.")
    private String confirmarSenha;

    @Valid
    private List<EnderecoDTO> enderecos;

    @Valid
    private List<CartaoDTO> cartoes;
}