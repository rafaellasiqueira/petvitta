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

    @GetMapping("/admin/cupons")
    public String cupons(Model model) {
        model.addAttribute("paginaAtual", "cupons");
        return "admin/cupons";
    }

    @GetMapping("/admin/trocas")
    public String trocas(Model model) {
        model.addAttribute("paginaAtual", "trocas");
        return "admin/trocas";
    }

    @GetMapping("/admin/auditoria")
    public String auditoria(Model model) {
        model.addAttribute("paginaAtual", "auditoria");
        return "admin/auditoria";
    }

    @GetMapping("/admin/sair")
    public String sair() {
        return "redirect:/admin/login";
    }
}