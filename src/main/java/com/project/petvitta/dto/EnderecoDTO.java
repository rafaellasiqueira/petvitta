package com.project.petvitta.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnderecoDTO {

    @Size(min = 3, max = 20, message = "O nome de identificação deve ter no mínimo 3 e máximo 20 caracteres.")
    private String nomeIdentificacao;

    @NotBlank(message = "O CEP é obrigatório.")
    @Size(max = 9, message = "O CEP deve ter no máximo 9 caracteres.")
    private String cep;

    @NotBlank(message = "O logradouro é obrigatório.")
    @Size(max = 150, message = "O logradouro deve ter no máximo 150 caracteres.")
    private String logradouro;

    @NotBlank(message = "O bairro é obrigatório.")
    @Size(max = 150, message = "O bairro deve ter no máximo 150 caracteres.")
    private String bairro;

    @NotBlank(message = "O número é obrigatório.")
    @Size(max = 20, message = "O número deve ter no máximo 20 caracteres.")
    @Pattern(regexp = "\\d*", message = "O número do endereço deve conter apenas números.")
    private String numero;

    @NotBlank(message = "A cidade é obrigatória.")
    @Size(max = 150, message = "A cidade deve ter no máximo 150 caracteres.")
    private String cidade;

    @NotBlank(message = "O país é obrigatório.")
    @Size(max = 50, message = "O país deve ter no máximo 50 caracteres.")
    private String pais;

    @Size(max = 500, message = "As observações devem ter no máximo 500 caracteres.")
    private String observacoes;

    @NotNull(message = "O tipo de endereço é obrigatório.")
    private Long tipoEndereco;

    @NotNull(message = "O tipo de residência é obrigatório.")
    private Long tipoResidencia;

    @NotNull(message = "O tipo de logradouro é obrigatório.")
    private Long tipoLogradouro;

    @NotNull(message = "O estado é obrigatório.")
    private Long estado;
}