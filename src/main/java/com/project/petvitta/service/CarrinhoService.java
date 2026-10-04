package com.project.petvitta.service;

import com.project.petvitta.model.carrinho.Carrinho;
import com.project.petvitta.model.carrinho.ItemCarrinho;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.produto.VariacaoProduto;
import com.project.petvitta.repository.carrinho.CarrinhoRepository;
import com.project.petvitta.repository.carrinho.ItemCarrinhoRepository;
import com.project.petvitta.repository.produto.VariacaoProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CarrinhoService {

    private final VariacaoProdutoRepository variacaoProdutoRepository;
    private final CarrinhoRepository carrinhoRepository;
    private final ItemCarrinhoRepository itemCarrinhoRepository;
    private final ClienteService clienteService;

    public CarrinhoService(
            VariacaoProdutoRepository variacaoProdutoRepository,
            CarrinhoRepository carrinhoRepository,
            ItemCarrinhoRepository itemCarrinhoRepository,
            ClienteService clienteService
    ) {
        this.variacaoProdutoRepository = variacaoProdutoRepository;
        this.carrinhoRepository = carrinhoRepository;
        this.itemCarrinhoRepository = itemCarrinhoRepository;
        this.clienteService = clienteService;
    }

    @Transactional
    public void adicionar(Long variacaoId, Integer quantidade) {
        if (variacaoId == null) {
            throw new IllegalArgumentException("Variação do produto não informada.");
        }

        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }

        VariacaoProduto variacao = variacaoProdutoRepository
                .findById(variacaoId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Produto não encontrado.")
                );

        if (variacao.getEstoqueAtual() == null || variacao.getEstoqueAtual() < quantidade) {
            throw new IllegalArgumentException("Quantidade maior que o estoque disponível.");
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        Carrinho carrinho = buscarPorCliente(cliente.getId());

        // Criando carrinho
        if (carrinho == null) {
            carrinho = new Carrinho();

            LocalDateTime agora = LocalDateTime.now();

            carrinho.setDataCriacao(agora);
            carrinho.setDataExpiracao(agora.plusMinutes(30));
            carrinho.setCliente(cliente);

            carrinho = carrinhoRepository.save(carrinho);
        }

        for (int i = 0; i < carrinho.getItens().size(); i++) {
            ItemCarrinho item = carrinho.getItens().get(i);

            if (item.getVariacao().getId().equals(variacao.getId())) {
                throw new IllegalArgumentException(
                        "Este produto com este tamanho já está no carrinho."
                );
            }
        }

        // Criando itens
        ItemCarrinho item = new ItemCarrinho();

        item.setQuantidade(quantidade);
        item.setCarrinho(carrinho);
        item.setVariacao(variacao);

        itemCarrinhoRepository.save(item);

        carrinho.setDataExpiracao(LocalDateTime.now().plusMinutes(30));

        variacao.setEstoqueAtual(variacao.getEstoqueAtual() - quantidade);

        variacaoProdutoRepository.save(variacao);
        carrinhoRepository.save(carrinho);
    }

    public Carrinho buscarPorCliente(Long clienteId) {
        return carrinhoRepository
                .findByClienteId(clienteId)
                .orElse(null);
    }

    @Transactional
    public void limparCarrinho(Long carrinhoId) {
        if (carrinhoId == null) {
            throw new IllegalArgumentException("Carrinho não informado.");
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        Carrinho carrinho = carrinhoRepository
                .findById(carrinhoId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Carrinho não encontrado.")
                );

        for (int i = 0; i < carrinho.getItens().size(); i++) {
            ItemCarrinho item = carrinho.getItens().get(i);

            VariacaoProduto variacao = item.getVariacao();

            variacao.setEstoqueAtual(variacao.getEstoqueAtual() + item.getQuantidade());

            variacaoProdutoRepository.save(variacao);
        }

        carrinho.getItens().clear();

        carrinhoRepository.save(carrinho);
    }

    @Transactional
    public void excluirItem(Long itemId) {
        if (itemId == null) {
            throw new IllegalArgumentException("Item não informado.");
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        Carrinho carrinho = carrinhoRepository
                .findByClienteId(cliente.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Carrinho não encontrado.")
                );

        ItemCarrinho item = itemCarrinhoRepository
                .findById(itemId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Item não encontrado.")
                );

        VariacaoProduto variacao = item.getVariacao();

        variacao.setEstoqueAtual(variacao.getEstoqueAtual() + item.getQuantidade());

        variacaoProdutoRepository.save(variacao);

        carrinho.getItens().remove(item);

        itemCarrinhoRepository.delete(item);

        carrinho.setDataExpiracao(LocalDateTime.now().plusMinutes(30));

        carrinhoRepository.save(carrinho);
    }

    @Transactional
    public List<ItemCarrinho> verificarExpiracao(Carrinho carrinho) {
        List<ItemCarrinho> itensExpirados = new ArrayList<>();

        if (carrinho == null) {
            return itensExpirados;
        }

        if (carrinho.getDataExpiracao() != null && LocalDateTime.now().isAfter(carrinho.getDataExpiracao())) {
            itensExpirados.addAll(carrinho.getItens());

            for (int i = 0; i < carrinho.getItens().size(); i++) {
                ItemCarrinho item = carrinho.getItens().get(i);
                VariacaoProduto variacao = item.getVariacao();

                variacao.setEstoqueAtual(variacao.getEstoqueAtual() + item.getQuantidade());

                variacaoProdutoRepository.save(variacao);
            }

            carrinho.getItens().clear();

            carrinhoRepository.save(carrinho);
        }

        return itensExpirados;
    }

    public boolean verificarAvisoExpiracao(Carrinho carrinho) {
        if (carrinho == null || carrinho.getDataExpiracao() == null) {
            return false;
        }

        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime aviso = carrinho.getDataExpiracao().minusMinutes(5);

        return agora.isAfter(aviso) && agora.isBefore(carrinho.getDataExpiracao());
    }

    @Transactional
    public void alterarQuantidade(Long itemId, Integer quantidade) {

        if (itemId == null) {
            throw new IllegalArgumentException("Item não informado.");
        }

        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException(
                    "A quantidade deve ser maior que zero."
            );
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        Carrinho carrinho = carrinhoRepository
                .findByClienteId(cliente.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Carrinho não encontrado.")
                );

        ItemCarrinho item = itemCarrinhoRepository
                .findById(itemId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Item não encontrado.")
                );


        VariacaoProduto variacao = item.getVariacao();

        if (quantidade > item.getQuantidade() && variacao.getEstoqueAtual() < quantidade - item.getQuantidade()) {

            throw new IllegalArgumentException("Quantidade maior que o estoque disponível.");
        }

        variacao.setEstoqueAtual(
                variacao.getEstoqueAtual() - (quantidade - item.getQuantidade())
        );
        item.setQuantidade(quantidade);
        carrinho.setDataExpiracao(LocalDateTime.now().plusMinutes(30));

        variacaoProdutoRepository.save(variacao);
        itemCarrinhoRepository.save(item);
        carrinhoRepository.save(carrinho);
    }

    @Transactional
    public void alterarTamanho(Long itemId, Long variacaoId) {
        if (itemId == null || variacaoId == null) {
            throw new IllegalArgumentException(
                    "Item e variação devem ser informados."
            );
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        Carrinho carrinho = carrinhoRepository
                .findByClienteId(cliente.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Carrinho não encontrado.")
                );

        ItemCarrinho item = itemCarrinhoRepository
                .findById(itemId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Item não encontrado.")
                );

        VariacaoProduto variacaoAtual = item.getVariacao();

        VariacaoProduto novaVariacao =
                variacaoProdutoRepository.findById(variacaoId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Variação não encontrada."
                                )
                        );

        if (variacaoAtual.getId().equals(novaVariacao.getId())) {
            return;
        }

        for (int i = 0; i < carrinho.getItens().size(); i++) {
            ItemCarrinho outroItem = carrinho.getItens().get(i);

            if (!outroItem.getId().equals(item.getId()) && outroItem.getVariacao().getId().equals(novaVariacao.getId())) {

                throw new IllegalArgumentException(
                        "Este produto com este tamanho já está no carrinho."
                );
            }
        }

        if (novaVariacao.getEstoqueAtual() < item.getQuantidade()) {
            throw new IllegalArgumentException(
                    "Estoque insuficiente para este tamanho."
            );
        }

        variacaoAtual.setEstoqueAtual(variacaoAtual.getEstoqueAtual() + item.getQuantidade());

        novaVariacao.setEstoqueAtual(novaVariacao.getEstoqueAtual() - item.getQuantidade());

        item.setVariacao(novaVariacao);

        carrinho.setDataExpiracao(LocalDateTime.now().plusMinutes(30));

        variacaoProdutoRepository.save(variacaoAtual);
        variacaoProdutoRepository.save(novaVariacao);
        itemCarrinhoRepository.save(item);
        carrinhoRepository.save(carrinho);
    }

}
