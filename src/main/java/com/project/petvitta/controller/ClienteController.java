package com.project.petvitta.controller;

import com.project.petvitta.model.Cliente;
import com.project.petvitta.repository.dominio.GeneroRepository;
import com.project.petvitta.repository.dominio.TipoTelefoneRepository;
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
