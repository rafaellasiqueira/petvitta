package com.project.petvitta.service;

import com.project.petvitta.dto.EnderecoDTO;
import com.project.petvitta.model.Cliente;
import com.project.petvitta.model.Endereco;
import com.project.petvitta.model.dominio.Estado;
import com.project.petvitta.model.dominio.TipoEndereco;
import com.project.petvitta.model.dominio.TipoLogradouro;
import com.project.petvitta.model.dominio.TipoResidencia;
import com.project.petvitta.repository.ClienteRepository;
import com.project.petvitta.repository.EnderecoRepository;
import com.project.petvitta.repository.dominio.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnderecoService {
    private final TipoEnderecoRepository tipoEnderecoRepository;
    private final TipoResidenciaRepository tipoResidenciaRepository;
    private final TipoLogradouroRepository tipoLogradouroRepository;
    private final EstadoRepository estadoRepository;
    private final ClienteRepository clienteRepository;

    public EnderecoService(
            TipoEnderecoRepository tipoEnderecoRepository,
            TipoResidenciaRepository tipoResidenciaRepository,
            TipoLogradouroRepository tipoLogradouroRepository,
            EstadoRepository estadoRepository,
            ClienteRepository clienteRepository
    ) {
        this.tipoEnderecoRepository = tipoEnderecoRepository;
        this.tipoResidenciaRepository = tipoResidenciaRepository;
        this.tipoLogradouroRepository = tipoLogradouroRepository;
        this.estadoRepository = estadoRepository;
        this.clienteRepository = clienteRepository;
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

    public void validarTiposEndereco(List<EnderecoDTO> enderecos) {
        if (enderecos == null || enderecos.isEmpty()) {
            throw new IllegalArgumentException(
                    "É obrigatório cadastrar pelo menos um endereço."
            );
        }

        boolean possuiCobranca = false;
        boolean possuiEntrega = false;

        for (int i = 0; i < enderecos.size(); i++) {
            EnderecoDTO endereco = enderecos.get(i);

            if (endereco != null && endereco.getTipoEndereco() != null) {
                Long tipoId = endereco.getTipoEndereco();

                if (tipoId == 1L) {
                    possuiCobranca = true;
                }

                if (tipoId == 2L) {
                    possuiEntrega = true;
                }

                if (tipoId == 3L) {
                    possuiCobranca = true;
                    possuiEntrega = true;
                }
            }
        }

        if (!possuiCobranca || !possuiEntrega) {
            throw new IllegalArgumentException(
                    "É necessário informar ao menos um endereço de Cobrança e um de Entrega (ou um endereço que atenda ambos)."
            );
        }
    }

    @Transactional
    public void adicionar(Long clienteId, EnderecoDTO dto) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        Endereco endereco = new Endereco();
        endereco.setNomeIdentificacao(dto.getNomeIdentificacao());
        endereco.setCep(dto.getCep());
        endereco.setLogradouro(dto.getLogradouro());
        endereco.setBairro(dto.getBairro());
        endereco.setNumero(dto.getNumero());
        endereco.setCidade(dto.getCidade());
        endereco.setPais(dto.getPais());
        endereco.setObservacoes(dto.getObservacoes());
        endereco.setCliente(cliente);

        endereco.setTipoEndereco(
                tipoEnderecoRepository.findById(dto.getTipoEndereco())
                        .orElseThrow(() -> new IllegalArgumentException("Tipo de endereço inválido."))
        );

        endereco.setTipoResidencia(
                tipoResidenciaRepository.findById(dto.getTipoResidencia())
                        .orElseThrow(() -> new IllegalArgumentException("Tipo de residência inválido."))
        );

        endereco.setTipoLogradouro(
                tipoLogradouroRepository.findById(dto.getTipoLogradouro())
                        .orElseThrow(() -> new IllegalArgumentException("Tipo de logradouro inválido."))
        );

        endereco.setEstado(
                estadoRepository.findById(dto.getEstado())
                        .orElseThrow(() -> new IllegalArgumentException("Estado inválido."))
        );

        cliente.getEnderecos().add(endereco);
    }

    private void validarAlteracaoTipoEndereco(
            Cliente cliente,
            Endereco endereco,
            Long novoTipoId
    ) {
        boolean possuiCobranca = false;
        boolean possuiEntrega = false;

        for (int i = 0; i < cliente.getEnderecos().size(); i++) {
            Endereco e = cliente.getEnderecos().get(i);

            if (!e.equals(endereco)) {
                Long tipoId = e.getTipoEndereco().getId();

                if (tipoId == 1L) {
                    possuiCobranca = true;
                }

                if (tipoId == 2L) {
                    possuiEntrega = true;
                }

                if (tipoId == 3L) {
                    possuiCobranca = true;
                    possuiEntrega = true;
                }
            }
        }

        if (novoTipoId == 1L) {
            possuiCobranca = true;
        }

        if (novoTipoId == 2L) {
            possuiEntrega = true;
        }

        if (novoTipoId == 3L) {
            possuiCobranca = true;
            possuiEntrega = true;
        }

        if (!possuiCobranca || !possuiEntrega) {
            throw new IllegalArgumentException(
                    "Não é possível alterar o tipo deste endereço, pois você deve possuir ao menos um endereço de cobrança e um de entrega."
            );
        }
    }

    @Transactional
    public void editar(Long clienteId, Long enderecoId, EnderecoDTO dto) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        Endereco endereco = null;

        for (int i = 0; i < cliente.getEnderecos().size(); i++) {
            Endereco e = cliente.getEnderecos().get(i);

            if (e.getId().equals(enderecoId)) {
                endereco = e;
                break;
            }
        }

        if (endereco == null) {
            throw new IllegalArgumentException(
                    "Esse endereço não pertence ao cliente."
            );
        }

        validarAlteracaoTipoEndereco(cliente, endereco, dto.getTipoEndereco());

        endereco.setNomeIdentificacao(dto.getNomeIdentificacao());
        endereco.setCep(dto.getCep());
        endereco.setLogradouro(dto.getLogradouro());
        endereco.setBairro(dto.getBairro());
        endereco.setNumero(dto.getNumero());
        endereco.setCidade(dto.getCidade());
        endereco.setPais(dto.getPais());
        endereco.setObservacoes(dto.getObservacoes());

        endereco.setTipoEndereco(tipoEnderecoRepository.findById(dto.getTipoEndereco())
                        .orElseThrow(() ->
                                new IllegalArgumentException("Tipo de endereço inválido.")));

        endereco.setTipoResidencia(tipoResidenciaRepository.findById(dto.getTipoResidencia())
                        .orElseThrow(() ->
                                new IllegalArgumentException("Tipo de residência inválido.")));

        endereco.setTipoLogradouro(tipoLogradouroRepository.findById(dto.getTipoLogradouro())
                        .orElseThrow(() ->
                                new IllegalArgumentException("Tipo de logradouro inválido.")));

        endereco.setEstado(estadoRepository.findById(dto.getEstado())
                        .orElseThrow(() ->
                                new IllegalArgumentException("Estado inválido.")));
    }

    public void adicionarAoCliente(
            Cliente cliente,
            List<EnderecoDTO> enderecos
    ) {

        for (int i = 0; i < enderecos.size(); i++) {
            EnderecoDTO dto = enderecos.get(i);

            Endereco endereco = new Endereco();

            endereco.setNomeIdentificacao(dto.getNomeIdentificacao());
            endereco.setCep(dto.getCep());
            endereco.setLogradouro(dto.getLogradouro());
            endereco.setBairro(dto.getBairro());
            endereco.setNumero(dto.getNumero());
            endereco.setCidade(dto.getCidade());
            endereco.setPais(dto.getPais());
            endereco.setObservacoes(dto.getObservacoes());
            endereco.setCliente(cliente);

            endereco.setTipoEndereco(tipoEnderecoRepository.findById(dto.getTipoEndereco())
                            .orElseThrow(() ->
                                    new IllegalArgumentException("Tipo de endereço inválido.")));

            endereco.setTipoResidencia(tipoResidenciaRepository.findById(dto.getTipoResidencia())
                            .orElseThrow(() ->
                                    new IllegalArgumentException("Tipo de residência inválido.")));

            endereco.setTipoLogradouro(tipoLogradouroRepository.findById(dto.getTipoLogradouro())
                            .orElseThrow(() ->
                                    new IllegalArgumentException("Tipo de logradouro inválido.")));

            endereco.setEstado(estadoRepository.findById(dto.getEstado())
                            .orElseThrow(() ->
                                    new IllegalArgumentException("Estado inválido.")));

            cliente.getEnderecos().add(endereco);
        }
    }

    @Transactional
    public void excluir(Long clienteId, Long enderecoId) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado."));

        Endereco endereco = null;

        for (int i = 0; i < cliente.getEnderecos().size(); i++) {
            Endereco e = cliente.getEnderecos().get(i);

            if (e.getId().equals(enderecoId)) {
                endereco = e;
                break;
            }
        }

        if (endereco == null) {
            throw new IllegalArgumentException(
                    "Esse endereço não pertence ao cliente."
            );
        }

        boolean possuiCobranca = false;
        boolean possuiEntrega = false;

        for (int i = 0; i < cliente.getEnderecos().size(); i++) {

            Endereco e = cliente.getEnderecos().get(i);

            if (!e.equals(endereco)) {

                Long tipoId = e.getTipoEndereco().getId();

                if (tipoId == 1L) {
                    possuiCobranca = true;
                }

                if (tipoId == 2L) {
                    possuiEntrega = true;
                }

                if (tipoId == 3L) {
                    possuiCobranca = true;
                    possuiEntrega = true;
                }
            }
        }

        if (!possuiCobranca || !possuiEntrega) {
            throw new IllegalArgumentException(
                    "Não é possível excluir este endereço, pois você deve possuir ao menos um endereço de cobrança e um de entrega."
            );
        }

        cliente.getEnderecos().remove(endereco);
    }
}