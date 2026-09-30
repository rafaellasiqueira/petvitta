package com.project.petvitta.service;

import com.project.petvitta.model.carrinho.Carrinho;
import com.project.petvitta.model.carrinho.ItemCarrinho;
import com.project.petvitta.model.cliente.Cartao;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.produto.VariacaoProduto;
import com.project.petvitta.repository.carrinho.CarrinhoRepository;
import com.project.petvitta.repository.carrinho.ItemCarrinhoRepository;
import com.project.petvitta.repository.cliente.ClienteRepository;
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
    private final ClienteRepository clienteRepository;

    public CarrinhoService(VariacaoProdutoRepository variacaoProdutoRepository, CarrinhoRepository carrinhoRepository, ItemCarrinhoRepository itemCarrinhoRepository, ClienteService clienteService, ClienteRepository clienteRepository) {
        this.variacaoProdutoRepository = variacaoProdutoRepository;
        this.carrinhoRepository = carrinhoRepository;
        this.itemCarrinhoRepository = itemCarrinhoRepository;
        this.clienteService = clienteService;
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public void adicionar(Long variacaoId, Integer quantidade) {

        VariacaoProduto variacao = variacaoProdutoRepository
                .findById(variacaoId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Produto não encontrado.")
                );

        if (quantidade > variacao.getEstoqueAtual()) {
            throw new IllegalArgumentException("Estoque insuficiente.");
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        Carrinho carrinho = carrinhoRepository
                .findByClienteId(cliente.getId())
                .orElse(null);

        // Se não existir carrinho, cria um
        if (carrinho == null) {
            carrinho = new Carrinho();

            LocalDateTime agora = LocalDateTime.now();

            carrinho.setDataCriacao(agora);
            carrinho.setDataExpiracao(agora.plusMinutes(1));
            carrinho.setCliente(cliente);

            carrinhoRepository.save(carrinho);
        }

        // Cria o item
        for (int i = 0; i < carrinho.getItens().size(); i++) {

            ItemCarrinho item = carrinho.getItens().get(i);

            if (item.getVariacao().getId().equals(variacao.getId())) {
                throw new IllegalArgumentException("Este produto com este tamanho já está no carrinho.");
            }
        }

        ItemCarrinho item = new ItemCarrinho();

        item.setQuantidade(quantidade);
        item.setCarrinho(carrinho);
        item.setVariacao(variacao);

        itemCarrinhoRepository.save(item);

        carrinho.setDataExpiracao(
                LocalDateTime.now().plusMinutes(1)
        );

        // Diminui o estoque
        variacao.setEstoqueAtual(
                variacao.getEstoqueAtual() - quantidade
        );

        variacaoProdutoRepository.save(variacao);
    }

    public Carrinho buscarPorCliente(Long clienteId) {
        return carrinhoRepository.findByClienteId(clienteId).orElse(null);
    }

    public void excluirItem(Long itemId) {
        ItemCarrinho itemCarrinho = itemCarrinhoRepository.findById(itemId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Item não encontrado."));

        itemCarrinhoRepository.delete(itemCarrinho);
    }

    public void limparCarrinho(Long carrinhoId) {
        Carrinho carrinho = carrinhoRepository.findById(carrinhoId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Carrinho não encontrado."));

        carrinho.getItens().clear();

        carrinhoRepository.save(carrinho);
    }

    @Transactional
    public List<ItemCarrinho> verificarExpiracao(Carrinho carrinho) {

        List<ItemCarrinho> itensExpirados = new ArrayList<>();

        if (LocalDateTime.now().isAfter(carrinho.getDataExpiracao())) {
            itensExpirados.addAll(carrinho.getItens());
            carrinho.getItens().clear();
            carrinhoRepository.save(carrinho);
        }

        return itensExpirados;
    }

    public boolean verificarAvisoExpiracao(Carrinho carrinho) {

        LocalDateTime agora = LocalDateTime.now();

        LocalDateTime aviso =
                carrinho.getDataExpiracao().minusMinutes(5);

        return agora.isAfter(aviso)
                && agora.isBefore(carrinho.getDataExpiracao());
    }
}
