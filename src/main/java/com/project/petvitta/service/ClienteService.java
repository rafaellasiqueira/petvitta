package com.project.petvitta.service;

import com.project.petvitta.dto.ClienteCadastroDTO;
import com.project.petvitta.dto.ClienteEdicaoDTO;
import com.project.petvitta.dto.AlterarSenhaDTO;
import com.project.petvitta.model.Cliente;
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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

        // CPF
        validarCpf(dto.getCpf());

        // Telefone
        validarTelefone(
                dto.getTelefone(),
                dto.getTipoTelefone()
        );

        // Senha
        senhaService.validarSenha(
                dto.getSenha(),
                dto.getConfirmarSenha()
        );

        // Endereços
        enderecoService.validarTiposEndereco(
                dto.getEnderecos()
        );

        // Cartões
        if (dto.getCartoes() != null) {

            int preferenciais = 0;

            for (var cartao : dto.getCartoes()) {

                cartaoService.validarCartao(cartao);

                if (cartao.isPreferencial()) {
                    preferenciais++;
                }
            }

            if (preferenciais > 1) {
                throw new IllegalArgumentException(
                        "Somente um cartão pode ser preferencial."
                );
            }
        }

        // CPF e e-mail
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

        // Busca gênero
        Genero genero = generoRepository
                .findById(dto.getGenero())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Gênero inválido."
                        )
                );

        // Busca tipo de telefone
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

        // Converte DTOs em entidades
        enderecoService.adicionarAoCliente(
                cliente,
                dto.getEnderecos()
        );

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

        return clienteRepository
                .findByNomeContainingIgnoreCase(nome.trim());
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

                if (!cliente.getGenero().getId()
                        .equals(genero)) {

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
            ClienteEdicaoDTO dto
    ) {

        Cliente cliente = buscarPorId(id);

        validarTelefone(
                dto.getTelefone(),
                dto.getTipoTelefone()
        );

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

        cliente.setNome(dto.getNome());
        cliente.setTelefone(dto.getTelefone());
        cliente.setGenero(genero);
        cliente.setTipoTelefone(tipoTelefone);

        return clienteRepository.save(cliente);
    }

    public void alterarSenha(
            Long id,
            AlterarSenhaDTO dto
    ) {

        Cliente cliente = buscarPorId(id);

        if (!senhaService.verificarSenha(
                dto.getSenhaAtual(),
                cliente.getSenha()
        )) {
            throw new IllegalArgumentException(
                    "A senha atual está incorreta."
            );
        }

        senhaService.validarSenha(
                dto.getNovaSenha(),
                dto.getConfirmarSenha()
        );

        cliente.setSenha(
                senhaService.criptografar(
                        dto.getNovaSenha()
                )
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

        if (justificativa == null ||
                justificativa.trim().isEmpty()) {

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

        if (justificativa == null ||
                justificativa.trim().isEmpty()) {

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

    private void validarCpf(String cpf) {

        if (cpf == null || cpf.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Preencha o CPF."
            );
        }

        cpf = cpf.replaceAll("\\D", "");

        if (cpf.length() != 11 ||
                cpf.matches("(\\d)\\1{10}")) {

            throw new IllegalArgumentException(
                    "Digite um CPF válido."
            );
        }

        int soma = 0;

        for (int i = 0; i < 9; i++) {

            soma += Character.getNumericValue(
                    cpf.charAt(i)
            ) * (10 - i);
        }

        int resto = soma % 11;
        int resultado = 11 - resto;

        if (resultado >= 10) {
            resultado = 0;
        }

        if (resultado != Character.getNumericValue(
                cpf.charAt(9)
        )) {
            throw new IllegalArgumentException(
                    "Digite um CPF válido."
            );
        }

        soma = 0;

        for (int i = 0; i < 10; i++) {

            soma += Character.getNumericValue(
                    cpf.charAt(i)
            ) * (11 - i);
        }

        resto = soma % 11;
        resultado = 11 - resto;

        if (resultado >= 10) {
            resultado = 0;
        }

        if (resultado != Character.getNumericValue(
                cpf.charAt(10)
        )) {
            throw new IllegalArgumentException(
                    "Digite um CPF válido."
            );
        }
    }

    private void validarTelefone(
            String telefone,
            Long tipoTelefone
    ) {

        if (telefone == null ||
                telefone.trim().isEmpty()) {

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

    private String gerarCodigo() {

        return String.valueOf(
                (int) (Math.random() * 900000) + 100000
        );
    }
}