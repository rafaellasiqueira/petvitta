package com.project.petvitta.controller;

import com.project.petvitta.dto.AlterarSenhaDTO;
import com.project.petvitta.dto.ClienteCadastroDTO;
import com.project.petvitta.dto.ClienteEdicaoDTO;
import com.project.petvitta.model.carrinho.Carrinho;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.cliente.Notificacao;
import com.project.petvitta.service.*;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Controller
public class ClienteController {

    private final ClienteService clienteService;
    private final EnderecoService enderecoService;
    private final CartaoService cartaoService;
    private final ProdutoService produtoService;
    private final CupomService cupomService;
    private final NotificacaoService notificacaoService;
    private final CarrinhoService carrinhoService;

    public ClienteController(
            ClienteService clienteService,
            EnderecoService enderecoService,
            CartaoService cartaoService,
            ProdutoService produtoService,
            CupomService cupomService, NotificacaoService notificacaoService, CarrinhoService carrinhoService

    ) {
        this.clienteService = clienteService;
        this.enderecoService = enderecoService;
        this.cartaoService = cartaoService;
        this.produtoService = produtoService;
        this.cupomService = cupomService;
        this.notificacaoService = notificacaoService;
        this.carrinhoService = carrinhoService;
        ;
    }

    @ModelAttribute
    public void carregarDadosCadastro(Model model) {
        model.addAttribute(
                "tiposTelefone",
                clienteService.listarTiposTelefone()
        );

        model.addAttribute(
                "generos",
                clienteService.listarGeneros()
        );

        model.addAttribute(
                "tiposEndereco",
                enderecoService.listarTiposEndereco()
        );

        model.addAttribute(
                "tiposResidencia",
                enderecoService.listarTiposResidencia()
        );

        model.addAttribute(
                "tiposLogradouro",
                enderecoService.listarTiposLogradouro()
        );

        model.addAttribute(
                "estados",
                enderecoService.listarEstados()
        );

        model.addAttribute(
                "bandeiras",
                cartaoService.listarBandeiras()
        );
    }

    @GetMapping("/cliente/login")
    public String login() {
        return "cliente/login";
    }

    @GetMapping("/cliente/cadastrar")
    public String cadastrar(Model model) {
        model.addAttribute(
                "cliente",
                new ClienteCadastroDTO()
        );
        return "cliente/cadastrar";
    }

    @PostMapping("/cliente/cadastrar")
    public String cadastrar(
            @Valid
            @ModelAttribute("cliente") ClienteCadastroDTO dto,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
        if (result.hasErrors()) {
            model.addAttribute(
                    "tipoToast",
                    "erro"
            );

            model.addAttribute(
                    "mensagemToast",
                    result.getFieldError().getDefaultMessage()
            );

            return "cliente/cadastrar";
        }

        try {
            clienteService.cadastrar(dto);

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Cadastro concluído com sucesso!"
            );

            return "redirect:/cliente/cadastrar";

        } catch (IllegalArgumentException e) {
            model.addAttribute(
                    "tipoToast",
                    "erro"
            );

            model.addAttribute(
                    "mensagemToast",
                    e.getMessage()
            );

            return "cliente/cadastrar";
        }
    }

    @GetMapping("/cliente/perfil")
    public String perfil(Model model) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        model.addAttribute("cliente", cliente);
        model.addAttribute("enderecos", cliente.getEnderecos());
        model.addAttribute("cartoes", cliente.getCartoes());
        model.addAttribute("cupons", cupomService.listarCupoms());
        model.addAttribute(
                "avisoExpiracao",
                verificarAvisoExpiracao()
        );

        return "cliente/perfil";
    }

    @PostMapping("/cliente/alterar")
    public String alterar(
            @Valid
            ClienteEdicaoDTO dto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    result.getFieldError().getDefaultMessage()
            );

            return "redirect:/cliente/perfil";
        }
        try {
            clienteService.alterar(1L, dto);
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Dados salvos com sucesso!"
            );

            return "redirect:/cliente/perfil";

        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    e.getMessage()
            );
            return "redirect:/cliente/perfil";
        }
    }

    @PostMapping("/cliente/alterar-senha")
    public String alterarSenha(
            @Valid
            AlterarSenhaDTO dto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    result.getFieldError().getDefaultMessage()
            );

            return "redirect:/cliente/perfil";
        }
        try {
            clienteService.alterarSenha(1L, dto);
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Senha alterada com sucesso!"
            );

        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    e.getMessage()
            );
        }
        return "redirect:/cliente/perfil";
    }

    @GetMapping("/cliente/finalizar-compra")
    public String finalizarCompra(Model model) {
        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        model.addAttribute(
                "avisoExpiracao",
                verificarAvisoExpiracao()
        );
        return "cliente/finalizar-compra";
    }

    @GetMapping("/cliente/pedido")
    public String pedido(Model model) {
        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        model.addAttribute(
                "avisoExpiracao",
                verificarAvisoExpiracao()
        );
        return "cliente/pedido";
    }

    @GetMapping("/cliente/notificacao")
    public String notificacao(Model model) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        model.addAttribute(
                "avisoExpiracao",
                verificarAvisoExpiracao()
        );

        return "cliente/notificacao";
    }

    @GetMapping("/cliente/inativo")
    public String inativo(Model model) {
        Cliente cliente = clienteService.buscarPorId(1L);

        model.addAttribute(
                "cliente",
                cliente
        );
        return "cliente/inativo";
    }

    @GetMapping("/cliente/sair")
    public String sair() {
        return "cliente/login";
    }

    private boolean verificarClienteAtivo() {
        Long clienteId = 1L;
        return clienteService.clienteAtivo(clienteId);
    }

    private boolean verificarAvisoExpiracao() {
        Cliente cliente = clienteService.buscarPorId(1L);

        Carrinho carrinho = carrinhoService.buscarPorCliente(cliente.getId());

        if (carrinho == null || carrinho.getItens().isEmpty()) {
            return false;
        }

        return carrinhoService.verificarAvisoExpiracao(carrinho);
    }
}