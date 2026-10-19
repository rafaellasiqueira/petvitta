package com.project.petvitta.service.pedido;

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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class PagamentoService {

    private final CartaoRepository cartaoRepository;
    private final CartaoCompraRepository cartaoCompraRepository;
    private final PagamentoRepository pagamentoRepository;

    public PagamentoService(
            CartaoRepository cartaoRepository,
            CartaoCompraRepository cartaoCompraRepository,
            PagamentoRepository pagamentoRepository
    ) {
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

        boolean possuiCupom = dto.getCuponsIds() != null && !dto.getCuponsIds().isEmpty();

        if (dto.getCartoes() != null) {
            for (int i = 0; i < dto.getCartoes().size(); i++) {

                CartaoPagamentoDTO cartaoDTO = dto.getCartoes().get(i);

                Long cartaoId = cartaoDTO.getCartaoId();
                Long cartaoTemporarioId = cartaoDTO.getCartaoTemporarioId();

                BigDecimal valor = cartaoDTO.getValor();

                if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
                    continue;
                }

                // Deve ser informado somente um tipo de cartão.
                if (cartaoId == null && cartaoTemporarioId == null) {
                    throw new IllegalArgumentException(
                            "Selecione um cartão válido."
                    );
                }

                // Valida cartão salvo.
                if (cartaoId != null) {
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
                }

                // Valida cartão temporário.
                else {
                    CartaoCompra cartaoCompra = cartaoCompraRepository
                                    .findById(cartaoTemporarioId)
                                    .orElseThrow(() ->
                                            new IllegalArgumentException(
                                                    "Cartão temporário não encontrado."
                                            ));

                    if (!cartaoCompra.getCliente().getId()
                            .equals(cliente.getId())) {
                        throw new IllegalArgumentException(
                                "O cartão não pertence ao cliente."
                        );
                    }

                    if (cartaoCompra.isUtilizado()) {
                        throw new IllegalArgumentException(
                                "Este cartão temporário já foi utilizado."
                        );
                    }
                }

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

        BigDecimal valorMinimo = new BigDecimal("10.00");

        if (valor.compareTo(valorMinimo) < 0 && !(possuiCupom && total.compareTo(valorMinimo) < 0)) {
            throw new IllegalArgumentException(
                    "Cada cartão deve pagar no mínimo R$ 10,00."
            );
        }
    }

    @Transactional
    public void salvarPagamentos(
            Pedido pedido,
            Cliente cliente,
            FinalizarCompraDTO dto
    ) {
        if (dto.getCartoes() == null) {
            return;
        }

        for (int i = 0; i < dto.getCartoes().size(); i++) {
            CartaoPagamentoDTO cartaoDTO = dto.getCartoes().get(i);

            Long cartaoId = cartaoDTO.getCartaoId();
            Long cartaoTemporarioId = cartaoDTO.getCartaoTemporarioId();
            BigDecimal valor = cartaoDTO.getValor();

            if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            // Salva pagamento com cartão já cadastrado.
            if (cartaoId != null && cartaoTemporarioId == null) {

                Cartao cartao = cartaoRepository.findById(cartaoId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Cartão não encontrado."
                                ));

                if (!cartao.getCliente().getId()
                        .equals(cliente.getId())) {
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

            // Salva pagamento com cartão temporário.
            else if (cartaoTemporarioId != null && cartaoId == null) {
                CartaoCompra cartaoCompra = cartaoCompraRepository
                                .findById(cartaoTemporarioId)
                                .orElseThrow(() ->
                                        new IllegalArgumentException(
                                                "Cartão temporário não encontrado."
                                        ));

                if (!cartaoCompra.getCliente().getId()
                        .equals(cliente.getId())) {
                    throw new IllegalArgumentException(
                            "O cartão não pertence ao cliente."
                    );
                }

                if (cartaoCompra.isUtilizado()) {
                    throw new IllegalArgumentException(
                            "Este cartão temporário já foi utilizado."
                    );
                }

                Pagamento pagamento = new Pagamento();
                pagamento.setPedido(pedido);
                pagamento.setCartaoCompra(cartaoCompra);
                pagamento.setValor(valor);

                pagamentoRepository.save(pagamento);

                cartaoCompra.setUtilizado(true);
                cartaoCompraRepository.save(cartaoCompra);
            }

            else {
                throw new IllegalArgumentException(
                        "Selecione um cartão válido."
                );
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
