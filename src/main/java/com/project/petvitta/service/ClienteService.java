package com.project.petvitta.service;

import com.project.petvitta.model.Cliente;
import com.project.petvitta.model.Endereco;
import com.project.petvitta.model.dominio.*;
import com.project.petvitta.repository.ClienteRepository;
import com.project.petvitta.repository.dominio.*;
import org.springframework.stereotype.Service;
import com.project.petvitta.dto.ClienteCadastroDTO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.project.petvitta.model.Cartao;

import java.util.List;

@Service
public class ClienteService {

    // Final, uma vez preenchido não pode ser mudado
    private final TipoTelefoneRepository tipoTelefoneRepository;
    private final GeneroRepository generoRepository;
    private final TipoEnderecoRepository tipoEnderecoRepository;
    private final TipoResidenciaRepository tipoResidenciaRepository;
    private final TipoLogradouroRepository tipoLogradouroRepository;
    private final EstadoRepository estadoRepository;
    private final BandeiraCartaoRepository bandeiraCartaoRepository;

    public ClienteService(
            TipoTelefoneRepository tipoTelefoneRepository,
            GeneroRepository generoRepository,
            TipoEnderecoRepository tipoEnderecoRepository,
            TipoResidenciaRepository tipoResidenciaRepository,
            TipoLogradouroRepository tipoLogradouroRepository,
            EstadoRepository estadoRepository,
            BandeiraCartaoRepository bandeiraCartaoRepository
    ) {
        this.tipoTelefoneRepository = tipoTelefoneRepository;
        this.generoRepository = generoRepository;
        this.tipoEnderecoRepository = tipoEnderecoRepository;
        this.tipoResidenciaRepository = tipoResidenciaRepository;
        this.tipoLogradouroRepository = tipoLogradouroRepository;
        this.estadoRepository = estadoRepository;
        this.bandeiraCartaoRepository = bandeiraCartaoRepository;
    }

    public List<TipoTelefone> listarTiposTelefone() {
        return tipoTelefoneRepository.findAll();
    }

    public List<Genero> listarGeneros() {
        return generoRepository.findAll();
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

    public List<BandeiraCartao> listarBandeiras() {
        return bandeiraCartaoRepository.findAll();
    }
}