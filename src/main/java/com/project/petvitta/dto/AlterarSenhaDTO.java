package com.project.petvitta.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlterarSenhaDTO {

    @NotBlank(message = "A senha atual é obrigatória.")
    private String senhaAtual;

    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 8, max = 100, message = "A senha deve ter entre 8 e 100 caracteres.")
    @Pattern(regexp = ".*[A-Z].*", message = "A senha deve ter pelo menos uma letra maiúscula.")
    @Pattern(regexp = ".*[a-z].*", message = "A senha deve ter pelo menos uma letra minúscula.")
    @Pattern(regexp = ".*[^A-Za-z0-9].*", message = "A senha deve ter pelo menos um caractere especial.")
    private String novaSenha;

    @NotBlank(message = "A confirmação da senha é obrigatória.")
    private String confirmarSenha;
}