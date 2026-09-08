package com.project.petvitta.controller;

import com.project.petvitta.model.Cliente;
import com.project.petvitta.service.ClienteService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class AdminController {

    private final ClienteService clienteService;

    public AdminController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/admin/login")
    public String login() {
        return "admin/login";
    }

    @GetMapping("/admin/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("paginaAtual", "dashboard");
        return "admin/dashboard";
    }

    @GetMapping("/admin/pedidos")
    public String pedidos(Model model) {
        model.addAttribute("paginaAtual", "pedidos");
        return "admin/pedidos";
    }

    @GetMapping("/admin/clientes")
    public String clientes(Model model) {

        model.addAttribute("paginaAtual", "clientes");

        model.addAttribute("clientes", clienteService.listarTodos());

        return "admin/clientes";
    }

    @GetMapping("/admin/detalhesCliente/{id}")
    public String detalhesCliente(
            @PathVariable Long id,
            Model model
    ) {
        Cliente cliente = clienteService.buscarPorId(id);

        model.addAttribute("paginaAtual", "clientes");
        model.addAttribute("cliente", cliente);
        model.addAttribute("enderecos", cliente.getEnderecos());

        return "admin/detalhesCliente";
    }

    @GetMapping("/admin/estoque")
    public String estoque(Model model) {
        model.addAttribute("paginaAtual", "estoque");
        return "admin/estoque";
    }

    @GetMapping("/admin/trocas")
    public String trocas(Model model) {
        model.addAttribute("paginaAtual", "trocas");
        return "admin/trocas";
    }

}