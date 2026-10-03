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
            throw new IllegalArgumentException("Estoque insuficiente.");
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        Carrinho carrinho = carrinhoRepository
                .findByClienteId(cliente.getId())
                .orElse(null);

        if (carrinho == null) {

            carrinho = new Carrinho();

            LocalDateTime agora = LocalDateTime.now();

            carrinho.setDataCriacao(agora);
            carrinho.setDataExpiracao(agora.plusMinutes(30));
            carrinho.setCliente(cliente);

            carrinho = carrinhoRepository.save(carrinho);
        }

        for (ItemCarrinho item : carrinho.getItens()) {

            if (item.getVariacao().getId().equals(variacao.getId())) {
                throw new IllegalArgumentException(
                        "Este produto com este tamanho já está no carrinho."
                );
            }
        }

        ItemCarrinho item = new ItemCarrinho();

        item.setQuantidade(quantidade);
        item.setCarrinho(carrinho);
        item.setVariacao(variacao);

        itemCarrinhoRepository.save(item);

        carrinho.setDataExpiracao(
                LocalDateTime.now().plusMinutes(30)
        );

        variacao.setEstoqueAtual(
                variacao.getEstoqueAtual() - quantidade
        );

        variacaoProdutoRepository.save(variacao);
        carrinhoRepository.save(carrinho);
    }

    public Carrinho buscarPorCliente(Long clienteId) {
        return carrinhoRepository
                .findByClienteId(clienteId)
                .orElse(null);
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

        validarItemPertenceAoCarrinho(item, carrinho);

        VariacaoProduto variacao = item.getVariacao();

        variacao.setEstoqueAtual(
                variacao.getEstoqueAtual() + item.getQuantidade()
        );

        variacaoProdutoRepository.save(variacao);

        carrinho.getItens().remove(item);

        itemCarrinhoRepository.delete(item);

        carrinho.setDataExpiracao(
                LocalDateTime.now().plusMinutes(30)
        );

        carrinhoRepository.save(carrinho);
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

        if (!carrinho.getCliente().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException(
                    "O carrinho não pertence ao cliente."
            );
        }

        for (ItemCarrinho item : carrinho.getItens()) {

            VariacaoProduto variacao = item.getVariacao();

            variacao.setEstoqueAtual(
                    variacao.getEstoqueAtual() + item.getQuantidade()
            );

            variacaoProdutoRepository.save(variacao);
        }

        carrinho.getItens().clear();

        carrinhoRepository.save(carrinho);
    }

    @Transactional
    public List<ItemCarrinho> verificarExpiracao(Carrinho carrinho) {

        List<ItemCarrinho> itensExpirados = new ArrayList<>();

        if (carrinho == null) {
            return itensExpirados;
        }

        if (carrinho.getDataExpiracao() != null
                && LocalDateTime.now().isAfter(carrinho.getDataExpiracao())) {

            itensExpirados.addAll(carrinho.getItens());

            for (ItemCarrinho item : carrinho.getItens()) {

                VariacaoProduto variacao = item.getVariacao();

                variacao.setEstoqueAtual(
                        variacao.getEstoqueAtual() + item.getQuantidade()
                );

                variacaoProdutoRepository.save(variacao);
            }

            carrinho.getItens().clear();

            carrinhoRepository.save(carrinho);
        }

        return itensExpirados;
    }

    public boolean verificarAvisoExpiracao(Carrinho carrinho) {

        if (carrinho == null
                || carrinho.getDataExpiracao() == null) {
            return false;
        }

        LocalDateTime agora = LocalDateTime.now();

        LocalDateTime aviso =
                carrinho.getDataExpiracao().minusMinutes(5);

        return agora.isAfter(aviso)
                && agora.isBefore(carrinho.getDataExpiracao());
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

        validarItemPertenceAoCarrinho(item, carrinho);

        VariacaoProduto variacao = item.getVariacao();

        int diferenca = quantidade - item.getQuantidade();

        if (diferenca > 0
                && variacao.getEstoqueAtual() < diferenca) {

            throw new IllegalArgumentException(
                    "Estoque insuficiente."
            );
        }

        variacao.setEstoqueAtual(
                variacao.getEstoqueAtual() - diferenca
        );

        item.setQuantidade(quantidade);

        carrinho.setDataExpiracao(
                LocalDateTime.now().plusMinutes(30)
        );

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

        validarItemPertenceAoCarrinho(item, carrinho);

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

        if (!variacaoAtual.getProduto().getId()
                .equals(novaVariacao.getProduto().getId())) {

            throw new IllegalArgumentException(
                    "A variação selecionada não pertence ao mesmo produto."
            );
        }

        for (ItemCarrinho outroItem : carrinho.getItens()) {

            if (!outroItem.getId().equals(item.getId())
                    && outroItem.getVariacao().getId()
                    .equals(novaVariacao.getId())) {

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

        variacaoAtual.setEstoqueAtual(
                variacaoAtual.getEstoqueAtual()
                        + item.getQuantidade()
        );

        novaVariacao.setEstoqueAtual(
                novaVariacao.getEstoqueAtual()
                        - item.getQuantidade()
        );

        item.setVariacao(novaVariacao);

        carrinho.setDataExpiracao(
                LocalDateTime.now().plusMinutes(30)
        );

        variacaoProdutoRepository.save(variacaoAtual);
        variacaoProdutoRepository.save(novaVariacao);
        itemCarrinhoRepository.save(item);
        carrinhoRepository.save(carrinho);
    }

    private void validarItemPertenceAoCarrinho(
            ItemCarrinho item,
            Carrinho carrinho
    ) {

        if (item.getCarrinho() == null
                || !item.getCarrinho().getId()
                .equals(carrinho.getId())) {

            throw new IllegalArgumentException(
                    "O item não pertence ao carrinho."
            );
        }
    }
}
