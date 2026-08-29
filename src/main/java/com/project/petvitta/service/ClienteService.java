package com.project.petvitta.service;

import com.project.petvitta.model.Cliente;
import com.project.petvitta.model.Endereco;
import com.project.petvitta.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import com.project.petvitta.dto.ClienteCadastroDTO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.project.petvitta.model.Cartao;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();


    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    private void validarSenha(String senha, String confirmarSenha) {

        if (!senha.equals(confirmarSenha)) {
            throw new IllegalArgumentException("As senhas não são iguais.");
        }

        if (senha.length() < 8) {
            throw new IllegalArgumentException(
                    "A senha deve possuir pelo menos 8 caracteres.");
        }

        if (!senha.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException(
                    "A senha deve possuir pelo menos uma letra maiúscula.");
        }

        if (!senha.matches(".*[a-z].*")) {
            throw new IllegalArgumentException(
                    "A senha deve possuir pelo menos uma letra minúscula.");
        }

        if (!senha.matches(".*[^a-zA-Z0-9].*")) {
            throw new IllegalArgumentException(
                    "A senha deve possuir pelo menos um caractere especial.");
        }
    }

    public Cliente cadastrar(ClienteCadastroDTO dto) {
        validarSenha(dto.getSenha(), dto.getConfirmarSenha());

        if (clienteRepository.findByCpf(dto.getCpf()).isPresent()) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        if (clienteRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }

        Cliente cliente = new Cliente();

        cliente.setNome(dto.getNome());
        cliente.setCpf(dto.getCpf());
        cliente.setTipoTelefone(dto.getTipoTelefone());
        cliente.setTelefone(dto.getTelefone());
        cliente.setGenero(dto.getGenero());
        cliente.setDataNascimento(dto.getDataNascimento());
        cliente.setEmail(dto.getEmail());
        cliente.setSenha(passwordEncoder.encode(dto.getSenha()));


        cliente.setAtivo(true);
        cliente.setRanking(0);
        cliente.setCodigo(gerarCodigo());

        if (dto.getEnderecos() == null || dto.getEnderecos().isEmpty()) {
            throw new IllegalArgumentException("É obrigatório cadastrar um endereço.");
        }

        for (Endereco endereco : dto.getEnderecos()) {
            endereco.setCliente(cliente);
            cliente.getEnderecos().add(endereco);
        }

        if (dto.getCartoes() != null) {
            for (Cartao cartao : dto.getCartoes()) {
                cartao.setCliente(cliente);
                cliente.getCartoes().add(cartao);
            }
        }

        return clienteRepository.save(cliente);
    }

    private String gerarCodigo() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }


    public Cliente atualizar(Long id, Cliente dados) {

        Cliente cliente = buscarPorId(id);

        if (!cliente.getCpf().equals(dados.getCpf())
                && clienteRepository.findByCpf(dados.getCpf()).isPresent()) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        if (!cliente.getEmail().equals(dados.getEmail())
                && clienteRepository.findByEmail(dados.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }

        cliente.setNome(dados.getNome());
        cliente.setGenero(dados.getGenero());
        cliente.setDataNascimento(dados.getDataNascimento());
        cliente.setCpf(dados.getCpf());
        cliente.setTipoTelefone(dados.getTipoTelefone());
        cliente.setTelefone(dados.getTelefone());
        cliente.setEmail(dados.getEmail());

        return clienteRepository.save(cliente);
    }

    public Cliente buscarPorId(Long id) {

        return clienteRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado."));
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public void inativar(Long id) {

        Cliente cliente = buscarPorId(id);

        cliente.setAtivo(false);

        clienteRepository.save(cliente);
    }

    public void ativar(Long id) {

        Cliente cliente = buscarPorId(id);

        cliente.setAtivo(true);

        clienteRepository.save(cliente);
    }
}
