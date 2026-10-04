package com.project.petvitta.service;

import com.project.petvitta.dto.CartaoDTO;
import com.project.petvitta.model.cliente.Cartao;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.dominio.BandeiraCartao;
import com.project.petvitta.model.pedido.CartaoTemporario;
import com.project.petvitta.repository.cliente.CartaoRepository;
import com.project.petvitta.repository.cliente.ClienteRepository;
import com.project.petvitta.repository.dominio.BandeiraCartaoRepository;
import com.project.petvitta.repository.pedido.CartaoTemporarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartaoService {

    private final CartaoRepository cartaoRepository;
    private final BandeiraCartaoRepository bandeiraCartaoRepository;
    private final ClienteRepository clienteRepository;
    private final CartaoTemporarioRepository cartaoTemporarioRepository;

    public CartaoService(
            BandeiraCartaoRepository bandeiraCartaoRepository,
            CartaoRepository cartaoRepository,
            ClienteRepository clienteRepository, CartaoTemporarioRepository cartaoTemporarioRepository
    ) {
        this.bandeiraCartaoRepository = bandeiraCartaoRepository;
        this.cartaoRepository = cartaoRepository;
        this.clienteRepository = clienteRepository;
        this.cartaoTemporarioRepository = cartaoTemporarioRepository;
    }

    public List<BandeiraCartao> listarBandeiras() {
        return bandeiraCartaoRepository.findAll();
    }

    public void validarCartao(CartaoDTO cartao) {
        if (cartao == null) {
            throw new IllegalArgumentException("Cartão inválido.");
        }

        String numero = cartao.getNumero().replaceAll("\\D", "");

        if (!numeroCartaoValido(numero)) {
            throw new IllegalArgumentException("Digite um número de cartão válido.");
        }
    }

    private boolean numeroCartaoValido(String numero) {
        if (numero == null || numero.length() != 16) {
            return false;
        }

        int soma = 0;

        for (int i = 0; i < numero.length(); i++) {
            int digito = Character.getNumericValue(numero.charAt(i));

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
            List<CartaoDTO> cartoes
    ) {
        if (cartoes == null || cartoes.isEmpty()) {
            return;
        }

        for (int i = 0; i < cartoes.size(); i++) {
            CartaoDTO dto = cartoes.get(i);

            validarCartao(dto);

            Cartao cartao = new Cartao();

            cartao.setNumero(dto.getNumero());
            cartao.setNomeImpresso(dto.getNomeImpresso());
            cartao.setCodigoSeguranca(dto.getCodigoSeguranca());
            cartao.setCliente(cliente);

            cartao.setBandeira(bandeiraCartaoRepository.findById(dto.getBandeira())
                            .orElseThrow(() ->
                                    new IllegalArgumentException("Bandeira de cartão inválida.")));

            cartao.setPreferencial(dto.isPreferencial());
            cliente.getCartoes().add(cartao);
        }
    }

    @Transactional
    public void adicionar(
            Long clienteId,
            CartaoDTO dto
    ) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado."));

        validarCartao(dto);

        BandeiraCartao bandeira = bandeiraCartaoRepository.findById(dto.getBandeira())
                .orElseThrow(() ->
                        new IllegalArgumentException("Bandeira de cartão inválida."));

        Cartao cartao = new Cartao();

        cartao.setNumero(dto.getNumero());
        cartao.setNomeImpresso(dto.getNomeImpresso());
        cartao.setCodigoSeguranca(dto.getCodigoSeguranca());
        cartao.setBandeira(bandeira);
        cartao.setCliente(cliente);

        boolean primeiroCartao = cliente.getCartoes().isEmpty();

        if (primeiroCartao) {
            dto.setPreferencial(true);
        }

        if (dto.isPreferencial()) {
            cliente.getCartoes().forEach(c ->
                    c.setPreferencial(false)
            );
        }

        cartao.setPreferencial(dto.isPreferencial());
        cliente.getCartoes().add(cartao);
    }

    @Transactional
    public CartaoTemporario adicionarTemporario(
            Long clienteId,
            CartaoDTO dto
    ) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado."));

        validarCartao(dto);

        BandeiraCartao bandeira = bandeiraCartaoRepository.findById(dto.getBandeira())
                .orElseThrow(() ->
                        new IllegalArgumentException("Bandeira de cartão inválida."));

        CartaoTemporario cartaoTemporario = new CartaoTemporario();

        cartaoTemporario.setNumero(dto.getNumero());
        cartaoTemporario.setNomeImpresso(dto.getNomeImpresso());
        cartaoTemporario.setCodigoSeguranca(dto.getCodigoSeguranca());
        cartaoTemporario.setBandeira(bandeira);
        cartaoTemporario.setCliente(cliente);
        cartaoTemporario.setUtilizado(false);

        return cartaoTemporarioRepository.save(cartaoTemporario);
    }

    @Transactional
    public void tornarPreferencial(Long clienteId, Long cartaoId) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado."));

        Cartao cartao = null;

        for (int i = 0; i < cliente.getCartoes().size(); i++) {

            Cartao c = cliente.getCartoes().get(i);

            if (c.getId().equals(cartaoId)) {
                cartao = c;
                break;
            }
        }

        if (cartao == null) {
            throw new IllegalArgumentException(
                    "Esse cartão não pertence ao cliente."
            );
        }

        cliente.getCartoes().forEach(c ->
                c.setPreferencial(false)
        );

        cartao.setPreferencial(true);
    }

    @Transactional
    public void excluirCartao(Long clienteId, Long cartaoId) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Cliente não encontrado."));

        Cartao cartao = null;

        for (int i = 0; i < cliente.getCartoes().size(); i++) {

            Cartao c = cliente.getCartoes().get(i);

            if (c.getId().equals(cartaoId)) {
                cartao = c;
                break;
            }
        }

        if (cartao == null) {
            throw new IllegalArgumentException(
                    "Esse cartão não pertence ao cliente."
            );
        }

        boolean eraPreferencial = cartao.isPreferencial();

        cliente.getCartoes().remove(cartao);

        if (eraPreferencial && !cliente.getCartoes().isEmpty()) {

            cliente.getCartoes().forEach(c ->
                    c.setPreferencial(false)
            );

            Cartao novoPreferencial = cliente.getCartoes().get(0);

            novoPreferencial.setPreferencial(true);
        }
    }

    public BandeiraCartao buscarBandeira(Long id) {
        return bandeiraCartaoRepository.findById(id)
                .orElse(null);
    }

    public CartaoTemporario buscarPorId(Long id) {

        CartaoTemporario cartao =
                cartaoTemporarioRepository.findById(id)
                        .orElse(null);

        if (cartao != null && cartao.isUtilizado()) {
            return null;
        }

        return cartao;
    }
}