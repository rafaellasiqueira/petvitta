package com.project.petvitta.service;

import com.project.petvitta.dto.ItemRetornoEstoqueDTO;
import com.project.petvitta.dto.ItemTrocaDTO;
import com.project.petvitta.dto.RetornoEstoqueDTO;
import com.project.petvitta.dto.SolicitarTrocaDTO;
import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.model.cliente.Notificacao;
import com.project.petvitta.model.dominio.MotivoTroca;
import com.project.petvitta.model.dominio.StatusTroca;
import com.project.petvitta.model.pedido.ItemPedido;
import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.model.produto.VariacaoProduto;
import com.project.petvitta.model.troca.ItemTroca;
import com.project.petvitta.model.troca.Troca;
import com.project.petvitta.repository.cliente.NotificacaoRepository;
import com.project.petvitta.repository.dominio.MotivoTrocaRepository;
import com.project.petvitta.repository.dominio.StatusTrocaRepository;
import com.project.petvitta.repository.pedido.ItemPedidoRepository;
import com.project.petvitta.repository.pedido.PedidoRepository;
import com.project.petvitta.repository.produto.VariacaoProdutoRepository;
import com.project.petvitta.repository.troca.ItemTrocaRepository;
import com.project.petvitta.repository.troca.TrocaRepository;
import com.project.petvitta.service.cliente.CupomService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TrocaService {

    private final MotivoTrocaRepository motivoTrocaRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final PedidoRepository pedidoRepository;
    private final TrocaRepository trocaRepository;
    private final StatusTrocaRepository statusTrocaRepository;
    private final ItemTrocaRepository itemTrocaRepository;
    private final VariacaoProdutoRepository variacaoProdutoRepository;
    private final CupomService cupomService;
    private final NotificacaoRepository notificacaoRepository;

    public TrocaService(
            MotivoTrocaRepository motivoTrocaRepository,
            ItemPedidoRepository itemPedidoRepository,
            PedidoRepository pedidoRepository,
            TrocaRepository trocaRepository, StatusTrocaRepository statusTrocaRepository, ItemTrocaRepository itemTrocaRepository, VariacaoProdutoRepository variacaoProdutoRepository, CupomService cupomService, NotificacaoRepository notificacaoRepository) {

        this.motivoTrocaRepository = motivoTrocaRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.pedidoRepository = pedidoRepository;
        this.trocaRepository = trocaRepository;
        this.statusTrocaRepository = statusTrocaRepository;
        this.itemTrocaRepository = itemTrocaRepository;
        this.variacaoProdutoRepository = variacaoProdutoRepository;
        this.cupomService = cupomService;
        this.notificacaoRepository = notificacaoRepository;
    }

    public List<MotivoTroca> listarMotivoTroca() {
        return motivoTrocaRepository.findAllByOrderByIdAsc();
    }

    public List<Troca> buscarPorCliente(Long clienteId) {
        return trocaRepository.findByClienteId(clienteId);
    }

    @Transactional
    public Troca solicitarTroca(SolicitarTrocaDTO dto, Long clienteId) {

        if (dto == null) {
            throw new IllegalArgumentException("Dados inválidos.");
        }

        validarSolicitacao(dto);

        MotivoTroca motivoTroca = motivoTrocaRepository
                .findById(dto.getMotivoTroca())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Motivo da troca inválido."));

        Pedido pedido = pedidoRepository
                .findById(dto.getPedidoId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Pedido não encontrado."));

        if (!pedido.getCliente().getId().equals(clienteId)) {
            throw new IllegalArgumentException(
                    "Você não tem permissão para solicitar troca deste pedido.");
        }

        Troca troca = new Troca();

        troca.setDataSolicitacao(LocalDateTime.now());
        troca.setJustificativaTroca(dto.getJustificativaTroca());
        troca.setMotivoTroca(motivoTroca);
        troca.setPedido(pedido);
        troca.setCliente(pedido.getCliente());
        troca.setCodigo(pedido.getCodigo());

        StatusTroca status = statusTrocaRepository
                .findByDescricao("Em troca")
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Status inicial do pedido não encontrado."
                        ));

        troca.setStatusTroca(status);

        adicionarItens(troca, dto.getItens());

        Troca trocaSalvo = trocaRepository.save(troca);

        return trocaSalvo;
    }

    private void validarSolicitacao(SolicitarTrocaDTO dto) {

        if (dto.getItens() == null || dto.getItens().isEmpty()) {
            throw new IllegalArgumentException(
                    "Selecione pelo menos um produto para trocar.");
        }

        for (int i = 0; i < dto.getItens().size(); i++) {
            ItemTrocaDTO item = dto.getItens().get(i);

            if (item.getQuantidade() == null || item.getQuantidade() < 1) {
                throw new IllegalArgumentException(
                        "A quantidade deve ser maior que zero.");
            }

            ItemPedido itemPedido = itemPedidoRepository
                    .findById(item.getItemPedidoId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Item do pedido não encontrado."));

            if (item.getQuantidade() > itemPedido.getQuantidade()) {
                throw new IllegalArgumentException(
                        "A quantidade solicitada para troca não pode ser maior que a quantidade comprada.");
            }
        }
    }

    private void adicionarItens(
            Troca troca,
            List<ItemTrocaDTO> itens) {

        for (int i = 0; i < itens.size(); i++) {
            ItemTrocaDTO dto = itens.get(i);

            ItemPedido itemPedido = itemPedidoRepository
                    .findById(dto.getItemPedidoId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Item do pedido não encontrado."));

            ItemTroca itemTroca = new ItemTroca();

            itemTroca.setQuantidade(dto.getQuantidade());
            itemTroca.setTroca(troca);
            itemTroca.setItemPedido(itemPedido);

            troca.getItens().add(itemTroca);
        }
    }

    public List<Troca> filtrarTroca(String status, String pesquisa) {
        List<Troca> trocas = trocaRepository.findAllByOrderByIdDesc();
        List<Troca> resultado = new ArrayList<>();

        for (int i = 0; i < trocas.size(); i++) {
            Troca troca = trocas.get(i);

            boolean encontrou = true;

            // Filtro por status
            if (status != null && !status.isBlank() && !status.equals("Todos")) {
                if (!troca.getStatusTroca().getDescricao().equalsIgnoreCase(status)) {
                    encontrou = false;
                }
            }

            // Filtro por código ou nome do cliente
            if (pesquisa != null && !pesquisa.isBlank()) {
                String pesquisaFormatada = pesquisa.toUpperCase()
                        .replace("TROC-", "")
                        .replace("TROC", "")
                        .trim();

                String codigo = troca.getCodigo().toUpperCase();
                String nomeCliente = troca.getCliente().getNome().toUpperCase();

                if (!codigo.contains(pesquisaFormatada) && !nomeCliente.contains(pesquisa.toUpperCase())) {
                    encontrou = false;
                }
            }

            if (encontrou) {
                resultado.add(troca);
            }
        }

        return resultado;
    }

    public void alterarStatus(Long trocaId, String descricao) {
        Troca troca = trocaRepository.findById(trocaId).orElseThrow();

        StatusTroca status = statusTrocaRepository.findByDescricao(descricao).orElseThrow();

        if(descricao.equals("Troca Autorizada")) {
            troca.setDataAprovacao(LocalDateTime.now());

            Notificacao notificacao = new Notificacao();

            notificacao.setTitulo("Sua solicitação de troca foi autorizada!");
            notificacao.setMensagem(
                    "A troca do seu pedido foi autorizada. " +
                            "Acompanhe as próximas atualizações."
            );
            notificacao.setTroca(troca);
            notificacao.setCliente(troca.getCliente());

            notificacaoRepository.save(notificacao);
        }

        if(descricao.equals("Troca Recusada")) {
            troca.setDataReprovacao(LocalDateTime.now());
        }

        if(descricao.equals("Item Recebido")) {
            troca.setDataRecebido(LocalDateTime.now());
        }

        if(descricao.equals("Trocado")) {
            troca.setDataTrocado(LocalDateTime.now());
        }

        troca.setStatusTroca(status);

        trocaRepository.save(troca);
    }

    @Transactional
    public Troca itemEnviado(Long trocaId, Long clienteId) {

        Troca troca = trocaRepository
                .findById(trocaId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Troca não encontrada."));

        if (!troca.getCliente().getId().equals(clienteId)) {
            throw new IllegalArgumentException(
                    "Você não tem permissão para alterar esta troca.");
        }

        StatusTroca status = statusTrocaRepository
                .findByDescricao("Item Enviado")
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Status da troca não encontrado."
                        ));

        troca.setStatusTroca(status);
        troca.setDataEnviado(LocalDateTime.now());

        return trocaRepository.save(troca);
    }

    @Transactional
    public Cupom retornoItens(RetornoEstoqueDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException("Dados inválidos.");
        }

        Troca troca = trocaRepository
                .findById(dto.getTrocaId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Troca não encontrada."));

        // Só devolve os itens ao estoque se essa opção foi escolhida
        if (dto.isRetornarEstoque()) {

            if (dto.getItens() == null || dto.getItens().isEmpty()) {
                throw new IllegalArgumentException(
                        "Selecione pelo menos um item.");
            }

            for (int i = 0; i < dto.getItens().size(); i++) {

                ItemRetornoEstoqueDTO itemDTO = dto.getItens().get(i);

                ItemTroca itemTroca = itemTrocaRepository
                        .findById(itemDTO.getItemTrocaId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Item da troca não encontrado."));

                if (!itemTroca.getTroca().getId().equals(troca.getId())) {
                    throw new IllegalArgumentException(
                            "O item não pertence a esta troca.");
                }

                Integer quantidade = itemDTO.getQuantidade();

                if (quantidade == null || quantidade < 1
                        || quantidade > itemTroca.getQuantidade()) {
                    throw new IllegalArgumentException(
                            "Quantidade inválida para retorno ao estoque.");
                }

                VariacaoProduto variacao = itemTroca.getItemPedido()
                        .getVariacaoProduto();

                variacao.setEstoqueAtual(
                        variacao.getEstoqueAtual() + quantidade
                );

                variacaoProdutoRepository.save(variacao);
            }
        }

        // Finaliza o recebimento da troca
        LocalDateTime agora = LocalDateTime.now();

        troca.setDataRecebido(agora);
        troca.setDataTrocado(agora);

        StatusTroca status = statusTrocaRepository
                .findByDescricao("Trocado")
                .orElseThrow(() -> new IllegalArgumentException(
                        "Status Trocado não encontrado."));

        troca.setStatusTroca(status);

        trocaRepository.save(troca);

        // Calcula o valor somente dos itens solicitados para troca
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (int i = 0; i < troca.getItens().size(); i++) {
            ItemTroca itemTroca = troca.getItens().get(i);

            BigDecimal valorUnitario = itemTroca
                    .getItemPedido()
                    .getVariacaoProduto()
                    .getValorVenda();

            BigDecimal valorQuantidade = valorUnitario.multiply(
                    BigDecimal.valueOf(itemTroca.getQuantidade())
            );

            valorTotal = valorTotal.add(valorQuantidade);
        }

        // Gera o cupom com o valor dos itens da troca
        return cupomService.gerarCupomTroca(valorTotal);
    }
}
