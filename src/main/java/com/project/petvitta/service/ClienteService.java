package com.project.petvitta.service;

import com.project.petvitta.dto.ClienteCadastroDTO;
import com.project.petvitta.model.Cartao;
import com.project.petvitta.model.Cliente;
import com.project.petvitta.model.Endereco;
import com.project.petvitta.model.dominio.*;
import com.project.petvitta.repository.ClienteRepository;
import com.project.petvitta.repository.dominio.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.regex.Pattern;

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
    private final ClienteRepository clienteRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public ClienteService(
            ClienteRepository clienteRepository,
            TipoTelefoneRepository tipoTelefoneRepository,
            GeneroRepository generoRepository,
            TipoEnderecoRepository tipoEnderecoRepository,
            TipoResidenciaRepository tipoResidenciaRepository,
            TipoLogradouroRepository tipoLogradouroRepository,
            EstadoRepository estadoRepository,
            BandeiraCartaoRepository bandeiraCartaoRepository
    ) {
        this.clienteRepository = clienteRepository;
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

    private void validarNome(String nome) {

        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Preencha o nome.");
        }

        if (nome.trim().length() < 3) {
            throw new IllegalArgumentException(
                    "Digite um nome com pelo menos 3 caracteres."
            );
        }

        if (!nome.matches("[A-Za-zÀ-ÿ\\s]+")) {
            throw new IllegalArgumentException(
                    "O nome deve conter apenas letras."
            );
        }
    }

    private void validarCpf(String cpf) {

        if (cpf == null || cpf.trim().isEmpty()) {
            throw new IllegalArgumentException("Preencha o CPF.");
        }

        cpf = cpf.replaceAll("\\D", "");

        if (cpf.length() != 11) {
            throw new IllegalArgumentException("Digite o CPF completo.");
        }

        if (cpf.matches("(\\d)\\1{10}")) {
            throw new IllegalArgumentException("Digite um CPF válido.");
        }

        int soma = 0;

        for (int i = 0; i < 9; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
        }

        int resto = soma % 11;
        int resultado = 11 - resto;

        if (resultado >= 10) {
            resultado = 0;
        }

        if (resultado != Character.getNumericValue(cpf.charAt(9))) {
            throw new IllegalArgumentException("Digite um CPF válido.");
        }

        soma = 0;

        for (int i = 0; i < 10; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
        }

        resto = soma % 11;
        resultado = 11 - resto;

        if (resultado >= 10) {
            resultado = 0;
        }

        if (resultado != Character.getNumericValue(cpf.charAt(10))) {
            throw new IllegalArgumentException("Digite um CPF válido.");
        }
    }

    private void validarTelefone(String telefone, Long tipoTelefone) {

        if (telefone == null || telefone.trim().isEmpty()) {
            throw new IllegalArgumentException("Preencha o telefone.");
        }

        String numero = telefone.replaceAll("\\D", "");

        if (tipoTelefone == null) {
            throw new IllegalArgumentException("Selecione o tipo de telefone.");
        }

        // 2 = Fixo
        if (tipoTelefone == 2L) {

            if (numero.length() != 10) {
                throw new IllegalArgumentException(
                        "Digite o telefone completo."
                );
            }

        } else {

            if (numero.length() != 11) {
                throw new IllegalArgumentException(
                        "Digite o telefone completo."
                );
            }
        }
    }

    private void validarDataNascimento(LocalDate dataNascimento) {

        if (dataNascimento == null) {
            throw new IllegalArgumentException(
                    "Preencha a data de nascimento."
            );
        }

        if (dataNascimento.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "A data não pode ser futura."
            );
        }
    }

    private void validarEmail(String email) {

        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Preencha o e-mail.");
        }

        String regex =
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

        if (!Pattern.matches(regex, email)) {
            throw new IllegalArgumentException(
                    "Digite um e-mail válido."
            );
        }
    }

    private void validarSenha(String senha, String confirmarSenha) {

        if (senha == null || senha.isEmpty()) {
            throw new IllegalArgumentException(
                    "Preencha a senha."
            );
        }

        if (confirmarSenha == null || confirmarSenha.isEmpty()) {
            throw new IllegalArgumentException(
                    "Confirme a senha."
            );
        }

        if (!senha.equals(confirmarSenha)) {
            throw new IllegalArgumentException(
                    "As senhas não coincidem."
            );
        }

        if (senha.length() < 8) {
            throw new IllegalArgumentException(
                    "A senha deve ter pelo menos 8 caracteres."
            );
        }

        if (!senha.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException(
                    "A senha deve ter pelo menos uma letra maiúscula."
            );
        }

        if (!senha.matches(".*[a-z].*")) {
            throw new IllegalArgumentException(
                    "A senha deve ter pelo menos uma letra minúscula."
            );
        }

        if (!senha.matches(".*[^A-Za-z0-9].*")) {
            throw new IllegalArgumentException(
                    "A senha deve ter pelo menos um caractere especial."
            );
        }
    }

    private void validarEndereco(Endereco endereco) {

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

        String cep = endereco.getCep().replaceAll("\\D", "");

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

    // COLOQUE AQUI
    private void validarTiposEndereco(List<Endereco> enderecos) {

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

            Long tipoId = endereco.getTipoEndereco().getId();

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

    private void validarCartao(Cartao cartao) {

        if (cartao == null) {
            throw new IllegalArgumentException(
                    "Cartão inválido."
            );
        }

        // Número do cartão
        if (cartao.getNumero() == null ||
                cartao.getNumero().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o número do cartão."
            );
        }

        String numero = cartao.getNumero().replaceAll("\\D", "");

        if (!numeroCartaoValido(numero)) {
            throw new IllegalArgumentException(
                    "Digite um número de cartão válido."
            );
        }

        // Nome impresso no cartão
        if (cartao.getNomeImpresso() == null ||
                cartao.getNomeImpresso().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o nome do cartão."
            );
        }

        if (cartao.getNomeImpresso().trim().length() < 3) {
            throw new IllegalArgumentException(
                    "Digite um nome com pelo menos 3 caracteres."
            );
        }

        if (!cartao.getNomeImpresso().matches("[A-Za-zÀ-ÿ\\s]+")) {
            throw new IllegalArgumentException(
                    "O nome do cartão deve conter apenas letras."
            );
        }

        // Bandeira
        if (cartao.getBandeira() == null ||
                cartao.getBandeira().getId() == null) {

            throw new IllegalArgumentException(
                    "Selecione a bandeira do cartão."
            );
        }

        // Código de segurança / CVV
        if (cartao.getCodigoSeguranca() == null ||
                cartao.getCodigoSeguranca().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o CVV."
            );
        }

        if (!cartao.getCodigoSeguranca().matches("\\d{4}")) {
            throw new IllegalArgumentException(
                    "Digite um CVV válido."
            );
        }
    }

    private boolean numeroCartaoValido(String numero) {

        if (numero == null || numero.length() != 16) {
            return false;
        }

        int soma = 0;

        for (int i = 0; i < numero.length(); i++) {

            int digito =
                    Character.getNumericValue(numero.charAt(i));

            if (i % 2 == 0) {

                digito *= 2;

                if (digito > 9) {
                    digito -= 9;
                }
            }

            soma += digito;
        }

        return soma % 10 == 0;
    }
    public Cliente cadastrar(ClienteCadastroDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Dados do cliente inválidos."
            );
        }

        // Dados pessoais
        validarNome(dto.getNome());
        validarCpf(dto.getCpf());
        validarTelefone(dto.getTelefone(), dto.getTipoTelefone());
        validarDataNascimento(dto.getDataNascimento());
        validarEmail(dto.getEmail());

        // Senha
        validarSenha(
                dto.getSenha(),
                dto.getConfirmarSenha()
        );

        // Endereços
        validarTiposEndereco(dto.getEnderecos());

        for (Endereco endereco : dto.getEnderecos()) {
            validarEndereco(endereco);
        }

        // Cartões
        if (dto.getCartoes() != null) {

            for (Cartao cartao : dto.getCartoes()) {
                validarCartao(cartao);
            }
        }

        if (clienteRepository.findByCpf(dto.getCpf()).isPresent()) {
            throw new IllegalArgumentException(
                    "CPF já cadastrado."
            );
        }

        if (clienteRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException(
                    "E-mail já cadastrado."
            );
        }

        Cliente cliente = new Cliente();

        // Dados pessoais
        cliente.setNome(dto.getNome());
        cliente.setCpf(dto.getCpf());
        cliente.setTelefone(dto.getTelefone());
        cliente.setDataNascimento(dto.getDataNascimento());
        cliente.setEmail(dto.getEmail());

        // Senha criptografada
        cliente.setSenha(
                passwordEncoder.encode(dto.getSenha())
        );

        // Dados iniciais
        cliente.setAtivo(true);
        cliente.setRanking(0);
        cliente.setCodigo(gerarCodigo());

        // Tipo de telefone
        TipoTelefone tipoTelefone = tipoTelefoneRepository
                .findById(dto.getTipoTelefone())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Tipo de telefone inválido."
                        )
                );

        cliente.setTipoTelefone(tipoTelefone);

        // Gênero
        Genero genero = generoRepository
                .findById(dto.getGenero())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Gênero inválido."
                        )
                );

        cliente.setGenero(genero);

        // Endereço obrigatório
        if (dto.getEnderecos() == null ||
                dto.getEnderecos().isEmpty()) {

            throw new IllegalArgumentException(
                    "É obrigatório cadastrar um endereço."
            );
        }

        // Endereços
        for (Endereco endereco : dto.getEnderecos()) {

            endereco.setCliente(cliente);

            // Tipo de endereço
            endereco.setTipoEndereco(
                    tipoEnderecoRepository
                            .findById(
                                    endereco.getTipoEndereco().getId()
                            )
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Tipo de endereço inválido."
                                    )
                            )
            );

            // Tipo de residência
            endereco.setTipoResidencia(
                    tipoResidenciaRepository
                            .findById(
                                    endereco.getTipoResidencia().getId()
                            )
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Tipo de residência inválido."
                                    )
                            )
            );

            // Tipo de logradouro
            endereco.setTipoLogradouro(
                    tipoLogradouroRepository
                            .findById(
                                    endereco.getTipoLogradouro().getId()
                            )
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Tipo de logradouro inválido."
                                    )
                            )
            );

            // Estado
            endereco.setEstado(
                    estadoRepository
                            .findById(
                                    endereco.getEstado().getId()
                            )
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Estado inválido."
                                    )
                            )
            );

            cliente.getEnderecos().add(endereco);
        }

        // Cartões
        if (dto.getCartoes() != null) {

            for (Cartao cartao : dto.getCartoes()) {

                cartao.setCliente(cliente);

                // Bandeira do cartão
                cartao.setBandeira(
                        bandeiraCartaoRepository
                                .findById(
                                        cartao.getBandeira().getId()
                                )
                                .orElseThrow(() ->
                                        new IllegalArgumentException(
                                                "Bandeira de cartão inválida."
                                        )
                                )
                );

                cliente.getCartoes().add(cartao);
            }
        }

        return clienteRepository.save(cliente);
    }

    private String gerarCodigo() {

        return String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );
    }

    public Cliente atualizar(Long id, Cliente dados) {

        Cliente cliente = buscarPorId(id);

        if (!cliente.getCpf().equals(dados.getCpf())
                && clienteRepository
                .findByCpf(dados.getCpf())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "CPF já cadastrado."
            );
        }

        if (!cliente.getEmail().equals(dados.getEmail())
                && clienteRepository
                .findByEmail(dados.getEmail())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "E-mail já cadastrado."
            );
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
                        new IllegalArgumentException(
                                "Cliente não encontrado."
                        )
                );
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