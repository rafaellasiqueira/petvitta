package com.project.petvitta.service;

import com.project.petvitta.dto.CartaoPagamentoDTO;
import com.project.petvitta.dto.FinalizarCompraDTO;
import com.project.petvitta.model.cliente.Cartao;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.pedido.CartaoCompra;
import com.project.petvitta.model.pedido.Pagamento;
import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.repository.cliente.CartaoRepository;
import com.project.petvitta.repository.pedido.CartaoCompraRepository;
import com.project.petvitta.repository.pedido.PagamentoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PagamentoService {
    private final CartaoRepository cartaoRepository;
    private final CartaoCompraRepository cartaoCompraRepository;
    private final PagamentoRepository pagamentoRepository;

    public PagamentoService(CartaoRepository cartaoRepository, CartaoCompraRepository cartaoCompraRepository, PagamentoRepository pagamentoRepository) {
        this.cartaoRepository = cartaoRepository;
        this.cartaoCompraRepository = cartaoCompraRepository;
        this.pagamentoRepository = pagamentoRepository;
    }

    public void validarPagamento(
            Cliente cliente,
            FinalizarCompraDTO dto,
            BigDecimal total
    ) {
        if (total.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        BigDecimal valorPago = BigDecimal.ZERO;
        int quantidadeCartoes = 0;

        boolean possuiCupom = dto.getCuponsIds() != null &&
                !dto.getCuponsIds().isEmpty();

        if (dto.getCartoes() != null) {
            for (int i = 0; i < dto.getCartoes().size(); i++) {

                Long cartaoId = dto.getCartoes().get(i).getCartaoId();
                BigDecimal valor = dto.getCartoes().get(i).getValor();


                if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
                    continue;
                }

                Cartao cartao = cartaoRepository.findById(cartaoId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Cartão não encontrado."
                                ));

                if (!cartao.getCliente().getId().equals(cliente.getId())) {
                    throw new IllegalArgumentException(
                            "O cartão não pertence ao cliente."
                    );
                }

                validarValorCartaoCupom(valor, total, possuiCupom);

                valorPago = valorPago.add(valor);
                quantidadeCartoes++;
            }
        }

        if (dto.getCartaoTemporarioId() != null) {

            CartaoCompra cartaoCompra =
                    cartaoCompraRepository
                            .findById(dto.getCartaoTemporarioId())
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Cartão temporário não encontrado."
                                    ));

            if (!cartaoCompra.getCliente().getId().equals(cliente.getId())) {
                throw new IllegalArgumentException(
                        "O cartão não pertence ao cliente."
                );
            }

            BigDecimal valor = dto.getValorCartaoTemporario();

            if (valor != null && valor.compareTo(BigDecimal.ZERO) > 0) {
                validarValorCartaoCupom(valor, total, possuiCupom);

                valorPago = valorPago.add(valor);
                quantidadeCartoes++;
            }
        }

        if (quantidadeCartoes == 0) {
            throw new IllegalArgumentException(
                    "Selecione ao menos uma forma de pagamento."
            );
        }

        if (valorPago.compareTo(total) != 0) {
            throw new IllegalArgumentException(
                    "O valor dos cartões deve ser igual ao total da compra."
            );
        }
    }

    private void validarValorCartaoCupom(
            BigDecimal valor,
            BigDecimal total,
            boolean possuiCupom
    ) {

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "O valor do cartão deve ser maior que zero."
            );
        }

        if (valor.compareTo(new BigDecimal("10.00")) < 0 && !(possuiCupom && total.compareTo(new BigDecimal("10.00")) < 0)) {
            throw new IllegalArgumentException(
                    "Cada cartão deve pagar no mínimo R$ 10,00."
            );
        }
    }

    public void salvarPagamentos(
            Pedido pedido,
            Cliente cliente,
            FinalizarCompraDTO dto
    ) {
        if (dto.getCartoes() != null) {
            for (int i = 0; i < dto.getCartoes().size(); i++) {

                CartaoPagamentoDTO cartaoDTO = dto.getCartoes().get(i);

                BigDecimal valor = cartaoDTO.getValor();

                if (valor != null && valor.compareTo(BigDecimal.ZERO) > 0) {

                    Cartao cartao = cartaoRepository
                            .findById(cartaoDTO.getCartaoId())
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Cartão não encontrado."
                                    ));

                    if (!cartao.getCliente().getId().equals(cliente.getId())) {
                        throw new IllegalArgumentException(
                                "O cartão não pertence ao cliente."
                        );
                    }

                    CartaoCompra cartaoCompra = copiarCartao(cartao);

                    Pagamento pagamento = new Pagamento();

                    pagamento.setPedido(pedido);
                    pagamento.setCartaoCompra(cartaoCompra);
                    pagamento.setValor(valor);

                    pagamentoRepository.save(pagamento);
                }
            }
        }

        if (dto.getCartaoTemporarioId() != null) {

            CartaoCompra cartaoCompra =
                    cartaoCompraRepository
                            .findById(dto.getCartaoTemporarioId())
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Cartão temporário não encontrado."
                                    ));

            if (!cartaoCompra.getCliente().getId().equals(cliente.getId())) {
                throw new IllegalArgumentException(
                        "O cartão não pertence ao cliente."
                );
            }

            BigDecimal valor = dto.getValorCartaoTemporario();

            if (valor != null && valor.compareTo(BigDecimal.ZERO) > 0) {

                Pagamento pagamento = new Pagamento();

                pagamento.setPedido(pedido);
                pagamento.setCartaoCompra(cartaoCompra);
                pagamento.setValor(valor);

                pagamentoRepository.save(pagamento);

                cartaoCompra.setUtilizado(true);
                cartaoCompraRepository.save(cartaoCompra);
            }
        }
    }

    private CartaoCompra copiarCartao(Cartao cartao) {

        CartaoCompra copia = new CartaoCompra();

        copia.setCliente(cartao.getCliente());
        copia.setNumero(cartao.getNumero());
        copia.setNomeImpresso(cartao.getNomeImpresso());
        copia.setCodigoSeguranca(cartao.getCodigoSeguranca());
        copia.setBandeira(cartao.getBandeira());

        copia.setUtilizado(true);

        return cartaoCompraRepository.save(copia);
    }
}
