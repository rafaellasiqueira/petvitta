package com.project.petvitta.service;

import com.project.petvitta.model.Cliente;
import com.project.petvitta.model.Endereco;
import com.project.petvitta.model.dominio.Estado;
import com.project.petvitta.model.dominio.TipoEndereco;
import com.project.petvitta.model.dominio.TipoLogradouro;
import com.project.petvitta.model.dominio.TipoResidencia;
import com.project.petvitta.repository.EnderecoRepository;
import com.project.petvitta.repository.dominio.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnderecoService {
    private final EnderecoRepository enderecoRepository;
    private final TipoEnderecoRepository tipoEnderecoRepository;
    private final TipoResidenciaRepository tipoResidenciaRepository;
    private final TipoLogradouroRepository tipoLogradouroRepository;
    private final EstadoRepository estadoRepository;

    public EnderecoService(
            TipoEnderecoRepository tipoEnderecoRepository,
            TipoResidenciaRepository tipoResidenciaRepository,
            TipoLogradouroRepository tipoLogradouroRepository,
            EstadoRepository estadoRepository,
            EnderecoRepository enderecoRepository
    ) {
        this.tipoEnderecoRepository = tipoEnderecoRepository;
        this.tipoResidenciaRepository = tipoResidenciaRepository;
        this.tipoLogradouroRepository = tipoLogradouroRepository;
        this.estadoRepository = estadoRepository;
        this.enderecoRepository = enderecoRepository;
    }

    public List<TipoEndereco> listarTiposEndereco() {
        return tipoEnderecoRepository.findAll();
    }

    public List<TipoResidencia> listarTiposResidencia() {
        return tipoResidenciaRepository.findAllByOrderByIdAsc();
    }

    public List<TipoLogradouro> listarTiposLogradouro() {
        return tipoLogradouroRepository.findAllByOrderByIdAsc();
    }

    public List<Estado> listarEstados() {
        return estadoRepository.findAll();
    }

    public void validarEndereco(Endereco endereco) {

        if (endereco == null) {
            throw new IllegalArgumentException(
                    "Endereço inválido."
            );
        }

        if (endereco.getTipoEndereco() == null ||
                endereco.getTipoEndereco().getId() == null) {

            throw new IllegalArgumentException(
                    "Selecione o tipo de endereço."
            );
        }

        if (endereco.getTipoResidencia() == null ||
                endereco.getTipoResidencia().getId() == null) {

            throw new IllegalArgumentException(
                    "Selecione o tipo de residência."
            );
        }

        if (endereco.getTipoLogradouro() == null ||
                endereco.getTipoLogradouro().getId() == null) {

            throw new IllegalArgumentException(
                    "Selecione o tipo de logradouro."
            );
        }

        if (endereco.getEstado() == null ||
                endereco.getEstado().getId() == null) {

            throw new IllegalArgumentException(
                    "Selecione o estado."
            );
        }

        if (endereco.getCep() == null ||
                endereco.getCep().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o CEP."
            );
        }

        String cep = endereco.getCep()
                .replaceAll("\\D", "");

        if (cep.length() != 8) {
            throw new IllegalArgumentException(
                    "Digite um CEP válido."
            );
        }

        if (endereco.getLogradouro() == null ||
                endereco.getLogradouro().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o logradouro."
            );
        }

        if (endereco.getBairro() == null ||
                endereco.getBairro().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o nome do bairro."
            );
        }

        if (endereco.getNumero() == null ||
                endereco.getNumero().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o número."
            );
        }

        if (!endereco.getNumero().matches("\\d+")) {
            throw new IllegalArgumentException(
                    "O número do endereço deve conter apenas números."
            );
        }

        if (endereco.getCidade() == null ||
                endereco.getCidade().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o nome da cidade."
            );
        }

        if (endereco.getPais() == null ||
                endereco.getPais().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o nome do país."
            );
        }
    }

    public void validarTiposEndereco(
            List<Endereco> enderecos
    ) {

        if (enderecos == null || enderecos.isEmpty()) {
            throw new IllegalArgumentException(
                    "É obrigatório cadastrar pelo menos um endereço."
            );
        }

        boolean possuiCobranca = false;
        boolean possuiEntrega = false;

        for (Endereco endereco : enderecos) {

            if (endereco == null ||
                    endereco.getTipoEndereco() == null ||
                    endereco.getTipoEndereco().getId() == null) {
                continue;
            }

            Long tipoId =
                    endereco.getTipoEndereco().getId();

            if (tipoId == 1L) {
                possuiCobranca = true;
            } else if (tipoId == 2L) {
                possuiEntrega = true;
            } else if (tipoId == 3L) {
                possuiCobranca = true;
                possuiEntrega = true;
            }
        }

        if (!possuiCobranca || !possuiEntrega) {
            throw new IllegalArgumentException(
                    "É necessário informar ao menos um endereço de Cobrança e um de Entrega (ou um endereço que atenda ambos)."
            );
        }
    }

    public void adicionarAoCliente(
            Cliente cliente,
            List<Endereco> enderecos
    ) {

        for (Endereco endereco : enderecos) {

            endereco.setCliente(cliente);

            endereco.setTipoEndereco(
                    tipoEnderecoRepository.findById(
                            endereco.getTipoEndereco().getId()
                    ).orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Tipo de endereço inválido."
                            )
                    )
            );

            endereco.setTipoResidencia(
                    tipoResidenciaRepository.findById(
                            endereco.getTipoResidencia().getId()
                    ).orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Tipo de residência inválido."
                            )
                    )
            );

            endereco.setTipoLogradouro(
                    tipoLogradouroRepository.findById(
                            endereco.getTipoLogradouro().getId()
                    ).orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Tipo de logradouro inválido."
                            )
                    )
            );

            endereco.setEstado(
                    estadoRepository.findById(
                            endereco.getEstado().getId()
                    ).orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Estado inválido."
                            )
                    )
            );

            cliente.getEnderecos().add(endereco);
        }
    }

    public void excluir(Long id) {

        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Endereço não encontrado."
                        )
                );

        enderecoRepository.delete(endereco);
    }
}