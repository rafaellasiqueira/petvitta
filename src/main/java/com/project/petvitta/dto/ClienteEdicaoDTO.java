package com.project.petvitta.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClienteEdicaoDTO {

    @Size(min = 3, max = 150, message = "O nome deve ter no mínimo 3 caracteres e no máximo 150 caracteres.")
    private String nome;

    @NotNull(message = "O tipo de telefone é obrigatório.")
    private Long tipoTelefone;

    @NotBlank(message = "O telefone é obrigatório.")
    private String telefone;

    @NotNull(message = "A data de nascimento é obrigatória.")
    @Past(message = "A data de nascimento deve ser anterior à data atual.")
    private LocalDate dataNascimento;

    @NotNull(message = "O gênero é obrigatório.")
    private Long genero;
}