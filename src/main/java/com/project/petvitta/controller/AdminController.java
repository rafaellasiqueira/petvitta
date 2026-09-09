package com.project.petvitta.controller;

import com.project.petvitta.model.Cliente;
import com.project.petvitta.service.ClienteService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.project.petvitta.model.dominio.AtivarMotivo;
import com.project.petvitta.model.dominio.InativarMotivo;
import com.project.petvitta.repository.dominio.AtivarMotivoRepository;
import com.project.petvitta.repository.dominio.InativarMotivoRepository;

import java.time.LocalDate;
import java.util.List;

@Controller
public class AdminController {

    private final ClienteService clienteService;
    private final InativarMotivoRepository inativarMotivoRepository;
    private final AtivarMotivoRepository ativarMotivoRepository;

    public AdminController(
            ClienteService clienteService,
            InativarMotivoRepository inativarMotivoRepository,
            AtivarMotivoRepository ativarMotivoRepository
    ) {
        this.clienteService = clienteService;
        this.inativarMotivoRepository = inativarMotivoRepository;
        this.ativarMotivoRepository = ativarMotivoRepository;
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
    public String clientes(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String telefone,
            @RequestParam(required = false) LocalDate dataNascimento,
            @RequestParam(required = false) Long genero,
            @RequestParam(required = false) Boolean status,
            Model model
    ) {

        model.addAttribute("paginaAtual", "clientes");

        model.addAttribute("clientes",
                clienteService.filtrarClientes(
                        nome,
                        cpf,
                        email,
                        telefone,
                        dataNascimento,
                        genero,
                        status
                )
        );

        model.addAttribute("generos", clienteService.listarGeneros());

        // ADICIONE ISSO
        model.addAttribute(
                "motivosInativacao",
                clienteService.listarMotivosInativacao()
        );

        model.addAttribute(
                "motivosAtivacao",
                clienteService.listarMotivosAtivacao()
        );

        model.addAttribute("nome", nome);
        model.addAttribute("cpf", cpf);
        model.addAttribute("email", email);
        model.addAttribute("telefone", telefone);
        model.addAttribute("dataNascimento", dataNascimento);
        model.addAttribute("genero", genero);
        model.addAttribute("status", status);

        return "admin/clientes";
    }

    @PostMapping("/admin/clientes/{id}/inativar")
    public String inativar(
            @PathVariable Long id,
            @RequestParam Long motivoInativar,
            @RequestParam String justificativaInativar
    ) {

        clienteService.inativar(
                id,
                motivoInativar,
                justificativaInativar
        );

        return "redirect:/admin/clientes";
    }

    @PostMapping("/admin/clientes/{id}/ativar")
    public String ativar(
            @PathVariable Long id,
            @RequestParam Long motivoAtivar,
            @RequestParam String justificativaAtivar
    ) {

        clienteService.ativar(
                id,
                motivoAtivar,
                justificativaAtivar
        );

        return "redirect:/admin/clientes";
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