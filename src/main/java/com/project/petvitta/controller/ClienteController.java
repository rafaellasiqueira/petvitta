package com.project.petvitta.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClienteController {
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
}
