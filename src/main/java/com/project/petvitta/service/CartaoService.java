package com.project.petvitta.service;

import com.project.petvitta.model.Cartao;
import com.project.petvitta.model.Cliente;
import com.project.petvitta.model.dominio.BandeiraCartao;
import com.project.petvitta.repository.CartaoRepository;
import com.project.petvitta.repository.ClienteRepository;
import com.project.petvitta.repository.dominio.BandeiraCartaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartaoService {
    private final CartaoRepository cartaoRepository;
    private final BandeiraCartaoRepository bandeiraCartaoRepository;
    private final ClienteRepository clienteRepository;

    public CartaoService(
            BandeiraCartaoRepository bandeiraCartaoRepository,
            CartaoRepository cartaoRepository,
            ClienteRepository clienteRepository
    ) {
        this.bandeiraCartaoRepository = bandeiraCartaoRepository;
        this.cartaoRepository = cartaoRepository;
        this.clienteRepository = clienteRepository;
    }

    public List<BandeiraCartao> listarBandeiras() {
        return bandeiraCartaoRepository.findAll();
    }

    public void validarCartao(Cartao cartao) {

        if (cartao == null) {
            throw new IllegalArgumentException(
                    "Cartão inválido."
            );
        }

        if (cartao.getNumero() == null ||
                cartao.getNumero().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o número do cartão."
            );
        }

        String numero = cartao.getNumero()
                .replaceAll("\\D", "");

        if (!numeroCartaoValido(numero)) {
            throw new IllegalArgumentException(
                    "Digite um número de cartão válido."
            );
        }

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

        if (!cartao.getNomeImpresso()
                .matches("[A-Za-zÀ-ÿ\\s]+")) {

            throw new IllegalArgumentException(
                    "O nome do cartão deve conter apenas letras."
            );
        }

        if (cartao.getBandeira() == null ||
                cartao.getBandeira().getId() == null) {

            throw new IllegalArgumentException(
                    "Selecione a bandeira do cartão."
            );
        }

        if (cartao.getCodigoSeguranca() == null ||
                cartao.getCodigoSeguranca().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Preencha o CVV."
            );
        }

        if (!cartao.getCodigoSeguranca()
                .matches("\\d{3,4}")) {

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

    public void adicionarAoCliente(
            Cliente cliente,
            List<Cartao> cartoes
    ) {

        if (cartoes == null || cartoes.isEmpty()) {
            return;
        }

        boolean primeiroCartao = cliente.getCartoes().isEmpty();

        for (Cartao cartao : cartoes) {

            cartao.setCliente(cliente);

            cartao.setBandeira(
                    bandeiraCartaoRepository.findById(
                            cartao.getBandeira().getId()
                    ).orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Bandeira de cartão inválida."
                            )
                    )
            );

            if (primeiroCartao) {
                cartao.setPreferencial(true);
                primeiroCartao = false;
            } else {
                cartao.setPreferencial(false);
            }

            cliente.getCartoes().add(cartao);
        }
    }

    @Transactional
    public void adicionar(Long clienteId, Cartao cartao, boolean preferencial) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Cliente não encontrado."
                        )
                );

        validarCartao(cartao);

        BandeiraCartao bandeira = bandeiraCartaoRepository
                .findById(cartao.getBandeira().getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Bandeira de cartão inválida."
                        )
                );

        cartao.setCliente(cliente);
        cartao.setBandeira(bandeira);

        boolean primeiroCartao = cliente.getCartoes().isEmpty();

        if (primeiroCartao) {
            preferencial = true;
        }

        if (preferencial) {
            cliente.getCartoes().forEach(c ->
                    c.setPreferencial(false)
            );
        }

        cartao.setPreferencial(preferencial);

        cliente.getCartoes().add(cartao);

        cartaoRepository.save(cartao);
    }

    @Transactional
    public void tornarPreferencial(Long clienteId, Long cartaoId) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Cliente não encontrado."
                        )
                );

        Cartao cartao = cliente.getCartoes()
                .stream()
                .filter(c -> c.getId().equals(cartaoId))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Esse cartão não pertence ao cliente."
                        )
                );

        cliente.getCartoes().forEach(c ->
                c.setPreferencial(false)
        );

        cartao.setPreferencial(true);

        cartaoRepository.save(cartao);
    }

    public void excluir(Long id) {

        Cartao cartao = cartaoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Cartão não encontrado."
                        )
                );

        cartaoRepository.delete(cartao);
    }
}