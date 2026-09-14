package com.project.petvitta.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartaoDTO {

    @NotBlank(message = "O número do cartão é obrigatório.")
    @Size(max = 19, message = "O número do cartão deve ter no máximo 19 caracteres.")
    @Pattern(regexp = "[0-9\\s]*", message = "O número do cartão deve conter apenas números.")
    private String numero;

    @NotBlank(message = "O nome impresso no cartão é obrigatório.")
    @Size(min = 3, max = 150, message = "O nome impresso no cartão deve ter entre 3 e 150 caracteres.")
    @Pattern(regexp = "[A-Za-zÀ-ÿ\\s]*", message = "O nome do cartão deve conter apenas letras.")
    private String nomeImpresso;

    @NotBlank(message = "O código de segurança é obrigatório.")
    @Size(min = 3, max = 4, message = "O código de segurança deve ter 3 ou 4 caracteres.")
    @Pattern(regexp = "\\d*", message = "O código de segurança deve conter apenas números.")
    private String codigoSeguranca;

    @NotNull(message = "A bandeira do cartão é obrigatória.")
    private Long bandeira;

    private boolean preferencial;
}