package com.project.petvitta.service;

import com.project.petvitta.dto.ClienteCadastroDTO;
import com.project.petvitta.model.Cartao;
import com.project.petvitta.model.Cliente;
import com.project.petvitta.model.Endereco;
import com.project.petvitta.model.dominio.AtivarMotivo;
import com.project.petvitta.model.dominio.Genero;
import com.project.petvitta.model.dominio.InativarMotivo;
import com.project.petvitta.model.dominio.TipoTelefone;
import com.project.petvitta.repository.ClienteRepository;
import com.project.petvitta.repository.dominio.AtivarMotivoRepository;
import com.project.petvitta.repository.dominio.GeneroRepository;
import com.project.petvitta.repository.dominio.InativarMotivoRepository;
import com.project.petvitta.repository.dominio.TipoTelefoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
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

    private final InativarMotivoRepository inativarMotivoRepository;
    private final AtivarMotivoRepository ativarMotivoRepository;

    public ClienteService(
            ClienteRepository clienteRepository,
            TipoTelefoneRepository tipoTelefoneRepository,
            GeneroRepository generoRepository,
            SenhaService senhaService,
            EnderecoService enderecoService,
            CartaoService cartaoService,
            InativarMotivoRepository inativarMotivoRepository,
            AtivarMotivoRepository ativarMotivoRepository
    ) {
        this.clienteRepository = clienteRepository;
        this.tipoTelefoneRepository = tipoTelefoneRepository;
        this.generoRepository = generoRepository;
        this.senhaService = senhaService;
        this.enderecoService = enderecoService;
        this.cartaoService = cartaoService;
        this.inativarMotivoRepository = inativarMotivoRepository;
        this.ativarMotivoRepository = ativarMotivoRepository;
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

    public boolean clienteAtivo(Long id) {
        Cliente cliente = buscarPorId(id);
        return cliente.isAtivo();
    }

    public List<Cliente> buscarPorNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            return listarTodos();
        }
        return clienteRepository.findByNomeContainingIgnoreCase(nome.trim());
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public List<Cliente> filtrarClientes(
            String nome,
            String cpf,
            String email,
            String telefone,
            LocalDate dataNascimento,
            Long genero,
            Boolean status
    ) {

        List<Cliente> todos = clienteRepository.findAll();
        List<Cliente> resultado = new ArrayList<>();

        for (Cliente cliente : todos) {

            boolean encontrou = true;

            if (nome != null && !nome.isEmpty()) {
                if (!cliente.getNome().toLowerCase()
                        .contains(nome.toLowerCase())) {

                    encontrou = false;
                }
            }

            if (cpf != null && !cpf.isEmpty()) {
                if (!cliente.getCpf().contains(cpf)) {
                    encontrou = false;
                }
            }

            if (email != null && !email.isEmpty()) {
                if (!cliente.getEmail().toLowerCase()
                        .contains(email.toLowerCase())) {

                    encontrou = false;
                }
            }

            if (telefone != null && !telefone.isEmpty()) {
                if (!cliente.getTelefone().contains(telefone)) {
                    encontrou = false;
                }
            }

            if (dataNascimento != null) {
                if (!cliente.getDataNascimento()
                        .equals(dataNascimento)) {

                    encontrou = false;
                }
            }

            if (genero != null) {
                if (!cliente.getGenero().getId().equals(genero)) {
                    encontrou = false;
                }
            }

            if (status != null) {
                if (cliente.isAtivo() != status) {
                    encontrou = false;
                }
            }

            if (encontrou) {
                resultado.add(cliente);
            }
        }

        return resultado;
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

    public List<InativarMotivo> listarMotivosInativacao() {
        return inativarMotivoRepository.findAllByOrderByIdAsc();
    }

    public List<AtivarMotivo> listarMotivosAtivacao() {
        return ativarMotivoRepository.findAllByOrderByIdAsc();
    }

    public void inativar(
            Long id,
            Long motivoId,
            String justificativa
    ) {

        Cliente cliente = buscarPorId(id);

        InativarMotivo motivo = inativarMotivoRepository
                .findById(motivoId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Motivo de inativação inválido."
                        )
                );

        if (justificativa == null || justificativa.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Informe uma justificativa."
            );
        }

        cliente.setAtivo(false);
        cliente.setMotivoInativacao(motivo);
        cliente.setJustificativaInativacao(
                justificativa.trim()
        );

        clienteRepository.save(cliente);
    }

    public void ativar(
            Long id,
            Long motivoId,
            String justificativa
    ) {

        Cliente cliente = buscarPorId(id);

        AtivarMotivo motivo = ativarMotivoRepository
                .findById(motivoId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Motivo de ativação inválido."
                        )
                );

        if (justificativa == null || justificativa.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Informe uma justificativa."
            );
        }

        cliente.setAtivo(true);
        cliente.setMotivoAtivacao(motivo);
        cliente.setJustificativaAtivacao(
                justificativa.trim()
        );

        clienteRepository.save(cliente);
    }

    @Transactional
    public void excluirEndereco(Long clienteId, Long enderecoId) {

        Cliente cliente = buscarPorId(clienteId);

        Endereco endereco = cliente.getEnderecos()
                .stream()
                .filter(e -> e.getId().equals(enderecoId))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Esse endereço não pertence ao cliente."
                        )
                );

        cliente.getEnderecos().remove(endereco);
    }


    @Transactional
    public void excluirCartao(Long clienteId, Long cartaoId) {

        Cliente cliente = buscarPorId(clienteId);

        Cartao cartao = cliente.getCartoes()
                .stream()
                .filter(c -> c.getId().equals(cartaoId))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Esse cartão não pertence ao cliente."
                        )
                );

        boolean eraPreferencial = cartao.isPreferencial();

        // Remove o cartão
        cliente.getCartoes().remove(cartao);

        // Se era o preferencial, escolhe outro
        if (eraPreferencial && !cliente.getCartoes().isEmpty()) {

            // Primeiro deixa todos como não preferenciais
            cliente.getCartoes().forEach(c ->
                    c.setPreferencial(false)
            );

            // Define o primeiro como preferencial
            Cartao novoPreferencial =
                    cliente.getCartoes().get(0);

            novoPreferencial.setPreferencial(true);
        }
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