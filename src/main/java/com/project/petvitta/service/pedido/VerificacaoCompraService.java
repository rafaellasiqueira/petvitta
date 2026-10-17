package com.project.petvitta.service.pedido;

import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.model.pedido.ItemPedido;
import com.project.petvitta.model.pedido.Pagamento;
import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.repository.dominio.StatusPedidoRepository;
import com.project.petvitta.repository.pedido.ItemPedidoRepository;
import com.project.petvitta.repository.pedido.PagamentoRepository;
import com.project.petvitta.repository.pedido.PedidoRepository;
import com.project.petvitta.service.cliente.CupomService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VerificacaoCompraService {

    private final PedidoRepository pedidoRepository;
    private final StatusPedidoRepository statusPedidoRepository;
    private final PagamentoRepository pagamentoRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final CupomService cupomService;

    public VerificacaoCompraService(
            PedidoRepository pedidoRepository,
            StatusPedidoRepository statusPedidoRepository,
            PagamentoRepository pagamentoRepository,
            ItemPedidoRepository itemPedidoRepository,
            CupomService cupomService) {
        this.pedidoRepository = pedidoRepository;
        this.statusPedidoRepository = statusPedidoRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.cupomService = cupomService;
    }

    @Transactional
    public void processarVerificacaoCompra(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Pedido não encontrado."));

        if (!"Em processamento".equals(pedido.getStatusPedido().getDescricao())) {
            return;
        }

        boolean aprovado = verificarCompra(pedido);

        if (aprovado) {
            pedido.setStatusPedido(statusPedidoRepository.findByDescricao("Aprovada")
                    .orElseThrow()
            );

            pedido.setDataAprovacao(LocalDateTime.now());

            List<Cupom> cupons = pedido.getCupons();

            cupomService.removerCuponsUsados(cupons);


            Cliente cliente = pedido.getCliente();
            cliente.setRanking(cliente.getRanking() + 10);


        } else {
            pedido.setStatusPedido(
                    statusPedidoRepository.findByDescricao("Reprovada")
                            .orElseThrow()
            );

            pedido.setDataReprovacaoPagamento(LocalDateTime.now());

            List<ItemPedido> itens = itemPedidoRepository.findByPedidoId(pedidoId);

            for (int i = 0; i < itens.size(); i++) {
                ItemPedido item = itens.get(i);

                item.getVariacaoProduto().setEstoqueAtual(
                        item.getVariacaoProduto().getEstoqueAtual()
                                + item.getQuantidade()
                );
            }

            itemPedidoRepository.saveAll(itens);
        }

        pedidoRepository.save(pedido);
    }

    private boolean verificarCompra(Pedido pedido) {
        List<Pagamento> pagamentos = pagamentoRepository.findByPedidoId(pedido.getId());

        boolean aprovado = true;

        for (int i = 0; i < pagamentos.size(); i++) {
            Pagamento pagamento = pagamentos.get(i);

            if (pagamento.getValor().compareTo(BigDecimal.ZERO) > 0) {
                String numeroCartao;

                if (pagamento.getCartaoCompra() != null) {
                    numeroCartao = pagamento.getCartaoCompra().getNumero();

                    if (!autorizar(numeroCartao)) {
                        aprovado = false;
                    }
                }
            }
        }

        List<Cupom> cupons = pedido.getCupons();

        if (cupons != null) {
            for (int i = 0; i < cupons.size(); i++) {
                Cupom cupom = cupons.get(i);

                if (!cupom.isAtivo() || cupom.getValidade().isBefore(LocalDateTime.now())) {
                    aprovado = false;
                }
            }
        }

        return aprovado;
    }

    public static boolean autorizar(String numeroCartao) {
        return numeroCartao != null && !numeroCartao.endsWith("0000");
    }
}
