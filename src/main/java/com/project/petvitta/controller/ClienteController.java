package com.project.petvitta.controller;

import com.project.petvitta.dto.ClienteCadastroDTO;
import com.project.petvitta.service.ClienteService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
@Controller
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(
            ClienteService clienteService)
    {
        this.clienteService = clienteService;
    }

    @GetMapping("/cliente/login")
    public String login() {
        return "cliente/login";
    }

    @GetMapping("/cliente/cadastrar")
    public String cadastrar(Model model) {

        model.addAttribute("cliente", new ClienteCadastroDTO());

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
                clienteService.listarTiposEndereco()
        );

        model.addAttribute(
                "tiposResidencia",
                clienteService.listarTiposResidencia()
        );

        model.addAttribute(
                "tiposLogradouro",
                clienteService.listarTiposLogradouro()
        );

        model.addAttribute(
                "estados",
                clienteService.listarEstados()
        );

        model.addAttribute(
                "bandeiras",
                clienteService.listarBandeiras()
        );

        return "cliente/cadastrar";
    }

    @PostMapping("/cliente/cadastrar")
    public String cadastrar(
            @ModelAttribute("cliente") ClienteCadastroDTO dto,
            RedirectAttributes redirectAttributes) {

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
    }

    @GetMapping("/cliente/produtos")
    public String produtos() {
        return "cliente/produtos";
    }

    @GetMapping("/cliente/detalhes-produto")
    public String detalhesProduto() {
        return "cliente/detalhes-produto";
    }

    @GetMapping("/cliente/carrinho")
    public String carrinho() {
        return "cliente/carrinho";
    }

    @GetMapping("/cliente/finalizar-compra")
    public String finalizarCompra() {
        return "cliente/finalizar-compra";
    }

    @GetMapping("/cliente/pedido")
    public String pedido() {
        return "cliente/pedido";
    }

    @GetMapping("/cliente/perfil")
    public String perfil() {
        return "cliente/perfil";
    }

    @GetMapping("/cliente/sair")
    public String sair() {
        return "cliente/login";
    }
}
