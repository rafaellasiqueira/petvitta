package com.project.petvitta.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

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
        return "admin/clientes";
    }

    @GetMapping("/admin/cadastrarCliente")
    public String cadastrarCliente(Model model) {
        model.addAttribute("paginaAtual", "clientes");
        return "admin/cadastrarCliente";
    }

    @GetMapping("/admin/detalhesCliente")
    public String detalhesCliente(Model model) {
        model.addAttribute("paginaAtual", "clientes");
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