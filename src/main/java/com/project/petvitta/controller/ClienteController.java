package com.project.petvitta.controller;

import com.project.petvitta.model.Cliente;
import com.project.petvitta.service.ClienteService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import com.project.petvitta.dto.ClienteCadastroDTO;

@Controller
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/cliente/login")
    public String login() {
        return "cliente/login";
    }

    @GetMapping("/cliente/cadastrar")
    public String cadastrar(Model model) {
        model.addAttribute("cliente", new ClienteCadastroDTO());
        return "cliente/cadastrar";
    }

    @PostMapping("/cliente/cadastrar")
    public String salvar(@ModelAttribute ClienteCadastroDTO dto) {
        clienteService.cadastrar(dto);
        return "redirect:/cliente/login";
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
