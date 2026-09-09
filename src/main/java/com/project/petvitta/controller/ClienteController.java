package com.project.petvitta.controller;

import com.project.petvitta.dto.ClienteCadastroDTO;
import com.project.petvitta.model.Cliente;
import com.project.petvitta.service.CartaoService;
import com.project.petvitta.service.ClienteService;
import com.project.petvitta.service.EnderecoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ClienteController {

    private final ClienteService clienteService;
    private final EnderecoService enderecoService;
    private final CartaoService cartaoService;

    public ClienteController(
            ClienteService clienteService,
            EnderecoService enderecoService,
            CartaoService cartaoService
    ) {
        this.clienteService = clienteService;
        this.enderecoService = enderecoService;
        this.cartaoService = cartaoService;
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

        if (!model.containsAttribute("cliente")) {
            model.addAttribute(
                    "cliente",
                    new ClienteCadastroDTO()
            );
        }

        return "cliente/cadastrar";
    }

    @PostMapping("/cliente/cadastrar")
    public String cadastrar(
            @ModelAttribute("cliente") ClienteCadastroDTO dto,
            Model model,
            RedirectAttributes redirectAttributes
    ) {
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

    @GetMapping("/cliente/produtos")
    public String produtos() {
        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        return "cliente/produtos";
    }

    @GetMapping("/cliente/perfil")
    public String perfil(Model model) {

        Long clienteId = 6L;

        Cliente cliente = clienteService.buscarPorId(clienteId);

        if (!cliente.isAtivo()) {
            model.addAttribute("cliente", cliente);

            return "cliente/inativo";
        }

        model.addAttribute("cliente", cliente);
        model.addAttribute("enderecos", cliente.getEnderecos());
        model.addAttribute("cartoes", cliente.getCartoes());

        return "cliente/perfil";
    }


    @PostMapping("/cliente/alterar")
    public String alterar(
            @RequestParam String nome,
            @RequestParam String telefone,
            @RequestParam Long genero,
            @RequestParam Long tipoTelefone,
            RedirectAttributes redirectAttributes,
            Model model
    ) {
        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        try {

            clienteService.alterar(
                    6L,
                    nome,
                    telefone,
                    genero,
                    tipoTelefone
            );

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

            model.addAttribute("tipoToast", "erro");
            model.addAttribute("mensagemToast", e.getMessage());

            return "cliente/perfil";
        }
    }

    private boolean verificarClienteAtivo() {

        Long clienteId = 6L;

        return clienteService.clienteAtivo(clienteId);
    }

    @PostMapping("/cliente/alterar-senha")
    public String alterarSenha(
            @RequestParam String senhaAtual,
            @RequestParam String novaSenha,
            @RequestParam String confirmarSenha,
            RedirectAttributes redirectAttributes
    ) {
        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        try {

            clienteService.alterarSenha(
                    6L,
                    senhaAtual,
                    novaSenha,
                    confirmarSenha
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Senha alterada com sucesso!"
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

    @PostMapping("/cliente/excluir-endereco")
    public String excluirEndereco(
            @RequestParam Long enderecoId,
            RedirectAttributes redirectAttributes
    ) {

        try {

            if (!verificarClienteAtivo()) {
                return "redirect:/cliente/inativo";
            }

            clienteService.excluirEndereco(
                    6L,
                    enderecoId
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Endereço excluído com sucesso."
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

        } catch (IllegalArgumentException e) {

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    e.getMessage()
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );
        }

        return "redirect:/cliente/perfil";
    }

    @PostMapping("/cliente/excluir-cartao")
    public String excluirCartao(
            @RequestParam Long cartaoId,
            RedirectAttributes redirectAttributes
    ) {

        try {

            if (!verificarClienteAtivo()) {
                return "redirect:/cliente/inativo";
            }

            clienteService.excluirCartao(
                    6L,
                    cartaoId
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Cartão excluído com sucesso."
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

        } catch (IllegalArgumentException e) {

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    e.getMessage()
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );
        }

        return "redirect:/cliente/perfil";
    }

    @GetMapping("/cliente/detalhes-produto")
    public String detalhesProduto() {
        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        return "cliente/detalhes-produto";
    }

    @GetMapping("/cliente/carrinho")
    public String carrinho() {
        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }
        return "cliente/carrinho";
    }

    @GetMapping("/cliente/finalizar-compra")
    public String finalizarCompra() {
        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }
        return "cliente/finalizar-compra";
    }

    @GetMapping("/cliente/pedido")
    public String pedido() {
        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }
        return "cliente/pedido";
    }

    @GetMapping("/cliente/inativo")
    public String inativo(Model model) {

        Long clienteId = 6L;

        Cliente cliente = clienteService.buscarPorId(clienteId);

        model.addAttribute("cliente", cliente);

        return "cliente/inativo";
    }

    @GetMapping("/cliente/sair")
    public String sair() {
        return "cliente/login";
    }
}