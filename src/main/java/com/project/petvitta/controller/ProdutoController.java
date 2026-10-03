package com.project.petvitta.controller;

import com.project.petvitta.model.carrinho.Carrinho;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.produto.Produto;
import com.project.petvitta.service.CarrinhoService;
import com.project.petvitta.service.ClienteService;
import com.project.petvitta.service.ProdutoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

@Controller
public class ProdutoController {

    private final ProdutoService produtoService;
    private final ClienteService clienteService;
    private final CarrinhoService carrinhoService;

    public ProdutoController(
            ProdutoService produtoService,
            ClienteService clienteService,
            CarrinhoService carrinhoService
    ) {
        this.produtoService = produtoService;
        this.clienteService = clienteService;
        this.carrinhoService = carrinhoService;
    }

    @GetMapping("/cliente/produtos")
    public String produtos(
            @RequestParam(required = false) String verTodos,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) List<String> tipoRacao,
            @RequestParam(required = false) List<String> tipoPetisco,
            @RequestParam(required = false) List<String> formaApresentacao,
            @RequestParam(required = false) List<String> especie,
            @RequestParam(required = false) List<String> idade,
            @RequestParam(required = false) List<String> porte,
            @RequestParam(required = false) Boolean transgenico,
            @RequestParam(required = false) Boolean gluten,
            @RequestParam(required = false) BigDecimal precoMinimo,
            @RequestParam(required = false) BigDecimal precoMaximo,
            @RequestParam(required = false) String categoria,
            Model model
    ) {

        if (!clienteService.clienteAtivo(1L)) {
            return "redirect:/cliente/inativo";
        }

        model.addAttribute(
                "tiposRacao",
                produtoService.listarTiposRacao()
        );

        model.addAttribute(
                "tiposPetisco",
                produtoService.listarTiposPetisco()
        );

        model.addAttribute(
                "formasApresentacao",
                produtoService.listarFormasApresentacao()
        );

        model.addAttribute(
                "especies",
                produtoService.listarEspecies()
        );

        model.addAttribute(
                "faixasEtarias",
                produtoService.listarFaixasEtarias()
        );

        model.addAttribute(
                "portes",
                produtoService.listarPortes()
        );

        model.addAttribute("tipoRacaoSelecionados", tipoRacao);
        model.addAttribute("tipoPetiscoSelecionados", tipoPetisco);
        model.addAttribute("formaApresentacaoSelecionadas", formaApresentacao);
        model.addAttribute("especiesSelecionadas", especie);
        model.addAttribute("idadesSelecionadas", idade);
        model.addAttribute("portesSelecionados", porte);
        model.addAttribute("transgenicoSelecionado", transgenico);
        model.addAttribute("glutenSelecionado", gluten);
        model.addAttribute("precoMinimo", precoMinimo);
        model.addAttribute("precoMaximo", precoMaximo);
        model.addAttribute("categoria", categoria);

        model.addAttribute(
                "produtos",
                produtoService.filtrar(
                        verTodos,
                        nome,
                        tipoRacao,
                        tipoPetisco,
                        formaApresentacao,
                        especie,
                        idade,
                        porte,
                        transgenico,
                        gluten,
                        precoMinimo,
                        precoMaximo,
                        categoria
                )
        );

        return "cliente/produtos";
    }

    @GetMapping("/cliente/detalhes-produto/{id}")
    public String detalhesProduto(
            @PathVariable Long id,
            Model model
    ) {

        Produto produto = produtoService.buscarPorId(id);

        model.addAttribute(
                "produto",
                produto
        );

        return "cliente/detalhes-produto";
    }
}