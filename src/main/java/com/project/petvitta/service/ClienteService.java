package com.project.petvitta.service;

import com.project.petvitta.dto.ClienteCadastroDTO;
import com.project.petvitta.model.Cliente;
import com.project.petvitta.model.dominio.Genero;
import com.project.petvitta.model.dominio.TipoTelefone;
import com.project.petvitta.repository.ClienteRepository;
import com.project.petvitta.repository.dominio.GeneroRepository;
import com.project.petvitta.repository.dominio.TipoTelefoneRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class ClienteService {

    private final TipoTelefoneRepository tipoTelefoneRepository;
    private final GeneroRepository generoRepository;
    private final ClienteRepository clienteRepository;

    private final SenhaService senhaService;
    private final EnderecoService enderecoService;
    private final CartaoService cartaoService;

    public ClienteService(
            ClienteRepository clienteRepository,
            TipoTelefoneRepository tipoTelefoneRepository,
            GeneroRepository generoRepository,
            SenhaService senhaService,
            EnderecoService enderecoService,
            CartaoService cartaoService
    ) {
        this.clienteRepository = clienteRepository;
        this.tipoTelefoneRepository = tipoTelefoneRepository;
        this.generoRepository = generoRepository;
        this.senhaService = senhaService;
        this.enderecoService = enderecoService;
        this.cartaoService = cartaoService;
    }

    public List<TipoTelefone> listarTiposTelefone() {
        return tipoTelefoneRepository.findAll();
    }

    public List<Genero> listarGeneros() {
        return generoRepository.findAll();
    }

    public Cliente cadastrar(ClienteCadastroDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Dados do cliente inválidos."
            );
        }

        // =========================
        // DADOS PESSOAIS
        // =========================

        validarNome(dto.getNome());
        validarCpf(dto.getCpf());
        validarTelefone(dto.getTelefone(), dto.getTipoTelefone());
        validarDataNascimento(dto.getDataNascimento());
        validarEmail(dto.getEmail());

        // =========================
        // SENHA
        // =========================

        senhaService.validarSenha(
                dto.getSenha(),
                dto.getConfirmarSenha()
        );

        // =========================
        // ENDEREÇOS
        // =========================

        enderecoService.validarTiposEndereco(
                dto.getEnderecos()
        );

        for (var endereco : dto.getEnderecos()) {
            enderecoService.validarEndereco(endereco);
        }

        // =========================
        // CARTÕES
        // =========================

        if (dto.getCartoes() != null) {
            for (var cartao : dto.getCartoes()) {
                cartaoService.validarCartao(cartao);
            }
        }

        // =========================
        // CPF E E-MAIL
        // =========================

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

        // =========================
// CRIA CLIENTE
// =========================

        Genero genero = generoRepository
                .findById(dto.getGenero())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Gênero inválido."
                        )
                );

        TipoTelefone tipoTelefone = tipoTelefoneRepository
                .findById(dto.getTipoTelefone())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Tipo de telefone inválido."
                        )
                );

        Cliente cliente = new Cliente();

        cliente.setNome(dto.getNome());
        cliente.setCpf(dto.getCpf());
        cliente.setTelefone(dto.getTelefone());
        cliente.setDataNascimento(dto.getDataNascimento());
        cliente.setEmail(dto.getEmail());
        cliente.setGenero(genero);
        cliente.setTipoTelefone(tipoTelefone);

        cliente.setSenha(
                senhaService.criptografar(dto.getSenha())
        );

        cliente.setAtivo(true);
        cliente.setRanking(0);
        cliente.setCodigo(gerarCodigo());

        // =========================
        // SALVA ENDEREÇOS
        // =========================

        enderecoService.adicionarAoCliente(
                cliente,
                dto.getEnderecos()
        );

        // =========================
        // SALVA CARTÕES
        // =========================

        cartaoService.adicionarAoCliente(
                cliente,
                dto.getCartoes()
        );

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

    public Cliente alterar(
            Long id,
            String nome,
            String telefone,
            Long generoId,
            Long tipoTelefoneId
    ) {
        Cliente cliente = buscarPorId(id);

        validarNome(nome);

        validarTelefone(
                telefone,
                tipoTelefoneId
        );

        Genero genero = generoRepository
                .findById(generoId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Gênero inválido."
                        )
                );

        TipoTelefone tipoTelefone = tipoTelefoneRepository
                .findById(tipoTelefoneId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Tipo de telefone inválido."
                        )
                );

        cliente.setNome(nome);
        cliente.setTelefone(telefone);
        cliente.setGenero(genero);
        cliente.setTipoTelefone(tipoTelefone);

        return clienteRepository.save(cliente);
    }

    public void alterarSenha(
            Long id,
            String senhaAtual,
            String novaSenha,
            String confirmarSenha
    ) {

        Cliente cliente = buscarPorId(id);

        if (senhaAtual == null || senhaAtual.isEmpty()) {
            throw new IllegalArgumentException(
                    "Preencha a senha atual."
            );
        }

        if (!senhaService.verificarSenha(
                senhaAtual,
                cliente.getSenha()
        )) {
            throw new IllegalArgumentException(
                    "A senha atual está incorreta."
            );
        }

        senhaService.validarSenha(
                novaSenha,
                confirmarSenha
        );

        cliente.setSenha(
                senhaService.criptografar(novaSenha)
        );

        clienteRepository.save(cliente);
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

        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) {
            throw new IllegalArgumentException(
                    "Digite um CPF válido."
            );
        }

        int soma = 0;

        for (int i = 0; i < 9; i++) {
            soma += Character.getNumericValue(cpf.charAt(i))
                    * (10 - i);
        }

        int resto = soma % 11;
        int resultado = 11 - resto;

        if (resultado >= 10) {
            resultado = 0;
        }

        if (resultado != Character.getNumericValue(cpf.charAt(9))) {
            throw new IllegalArgumentException(
                    "Digite um CPF válido."
            );
        }

        soma = 0;

        for (int i = 0; i < 10; i++) {
            soma += Character.getNumericValue(cpf.charAt(i))
                    * (11 - i);
        }

        resto = soma % 11;
        resultado = 11 - resto;

        if (resultado >= 10) {
            resultado = 0;
        }

        if (resultado != Character.getNumericValue(cpf.charAt(10))) {
            throw new IllegalArgumentException(
                    "Digite um CPF válido."
            );
        }
    }

    private void validarTelefone(
            String telefone,
            Long tipoTelefone
    ) {

        if (telefone == null || telefone.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Preencha o telefone."
            );
        }

        if (tipoTelefone == null) {
            throw new IllegalArgumentException(
                    "Selecione o tipo de telefone."
            );
        }

        String numero = telefone.replaceAll("\\D", "");

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

    private void validarDataNascimento(
            LocalDate dataNascimento
    ) {

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
            throw new IllegalArgumentException(
                    "Preencha o e-mail."
            );
        }

        String regex =
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

        if (!Pattern.matches(regex, email)) {
            throw new IllegalArgumentException(
                    "Digite um e-mail válido."
            );
        }
    }

    private String gerarCodigo() {

        return String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );
    }
}