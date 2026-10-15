package com.project.petvitta.service;

import com.project.petvitta.dto.ItemTrocaDTO;
import com.project.petvitta.dto.SolicitarTrocaDTO;
import com.project.petvitta.model.dominio.MotivoTroca;
import com.project.petvitta.model.dominio.StatusPedido;
import com.project.petvitta.model.dominio.StatusTroca;
import com.project.petvitta.model.pedido.ItemPedido;
import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.model.produto.VariacaoProduto;
import com.project.petvitta.model.troca.ItemTroca;
import com.project.petvitta.model.troca.Troca;
import com.project.petvitta.repository.dominio.MotivoTrocaRepository;
import com.project.petvitta.repository.dominio.StatusTrocaRepository;
import com.project.petvitta.repository.pedido.ItemPedidoRepository;
import com.project.petvitta.repository.pedido.PedidoRepository;
import com.project.petvitta.repository.troca.TrocaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

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

    public TrocaService(
            MotivoTrocaRepository motivoTrocaRepository,
            ItemPedidoRepository itemPedidoRepository,
            PedidoRepository pedidoRepository,
            TrocaRepository trocaRepository, StatusTrocaRepository statusTrocaRepository) {

        this.motivoTrocaRepository = motivoTrocaRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.pedidoRepository = pedidoRepository;
        this.trocaRepository = trocaRepository;
        this.statusTrocaRepository = statusTrocaRepository;
    }

    public List<MotivoTroca> listarMotivoTroca() {
        return motivoTrocaRepository.findAll();
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
        List<Troca> trocas = trocaRepository.findAll();
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
        }

        if(descricao.equals("Troca Recusada")) {
            troca.setDataReprovacao(LocalDateTime.now());
        }

        if(descricao.equals("Trocado")) {
            troca.setDataTrocado(LocalDateTime.now());
        }

        troca.setStatusTroca(status);

        trocaRepository.save(troca);
    }
}
