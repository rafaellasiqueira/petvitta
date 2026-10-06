package com.project.petvitta.controller;

import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.dominio.StatusPedido;
import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.model.produto.Produto;
import com.project.petvitta.model.produto.VariacaoProduto;
import com.project.petvitta.service.AuditoriaService;
import com.project.petvitta.service.ClienteService;
import com.project.petvitta.service.PedidoService;
import com.project.petvitta.service.ProdutoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Controller
public class AdminController {

    private final ClienteService clienteService;
    private final ProdutoService produtoService;
    private final PedidoService pedidoService;
    private final AuditoriaService auditoriaService;

    public AdminController(
            ClienteService clienteService,
            ProdutoService produtoService,
            PedidoService pedidoService, AuditoriaService auditoriaService
    ) {
        this.clienteService = clienteService;
        this.produtoService = produtoService;
        this.pedidoService = pedidoService;
        this.auditoriaService = auditoriaService;
    }

    @ModelAttribute
    public void carregarDadosAdmin(Model model) {

        model.addAttribute(
                "generos",
                clienteService.listarGeneros()
        );

        model.addAttribute(
                "motivosInativacao",
                clienteService.listarMotivosInativacao()
        );

        model.addAttribute(
                "motivosAtivacao",
                clienteService.listarMotivosAtivacao()
        );


        model.addAttribute("generos",
                clienteService.listarGeneros()
        );
    }

    @GetMapping("/admin/login")
    public String login() {
        return "admin/login";
    }

    @GetMapping("/admin/dashboard")
    public String dashboard(Model model) {
        model.addAttribute(
                "paginaAtual",
                "dashboard");

        return "admin/dashboard";
    }

    @GetMapping("/admin/pedidos")
    public String pedidos(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String pesquisa,
            Model model) {

        model.addAttribute("paginaAtual", "pedidos");

        List<Pedido> pedidos = pedidoService.filtrarPedidos(status, pesquisa);

        model.addAttribute("pedidos", pedidos);
        model.addAttribute("statusSelecionado", status);
        model.addAttribute("pesquisa", pesquisa);

        return "admin/pedidos";
    }

    @PostMapping("/admin/pedido/status")
    public String alterarStatus(
            @RequestParam Long pedidoId,
            @RequestParam String descricao,
            RedirectAttributes redirectAttributes) {

        pedidoService.alterarStatus(pedidoId, descricao);

        redirectAttributes.addFlashAttribute(
                "tipoToast",
                "sucesso"
        );

        redirectAttributes.addFlashAttribute(
                "mensagemToast",
                "Status alterado com sucesso!"
        );

        return "redirect:/admin/pedidos";
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
        model.addAttribute("paginaAtual",
                "clientes");

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
            @RequestParam String justificativaInativar,
            RedirectAttributes redirectAttributes
    ) {

        clienteService.inativar(
                id,
                motivoInativar,
                justificativaInativar
        );

        redirectAttributes.addFlashAttribute(
                "mensagemToast",
                "Cliente inativado com sucesso!"
        );

        redirectAttributes.addFlashAttribute(
                "tipoToast",
                "sucesso"
        );

        return "redirect:/admin/clientes";
    }

    @PostMapping("/admin/clientes/{id}/ativar")
    public String ativar(
            @PathVariable Long id,
            @RequestParam Long motivoAtivar,
            @RequestParam String justificativaAtivar,
            RedirectAttributes redirectAttributes
    ) {

        clienteService.ativar(
                id,
                motivoAtivar,
                justificativaAtivar
        );

        redirectAttributes.addFlashAttribute(
                "mensagemToast",
                "Cliente ativado com sucesso!"
        );

        redirectAttributes.addFlashAttribute(
                "tipoToast",
                "sucesso"
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
    public String estoque(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String pesquisa,
            Model model) {

        System.out.println("STATUS: " + status);
        System.out.println("PESQUISA: " + pesquisa);

        model.addAttribute("paginaAtual", "estoque");

        model.addAttribute(
                "variacoes",
                produtoService.filtrarEstoque(status, pesquisa)
        );

        model.addAttribute("statusSelecionado", status);
        model.addAttribute("pesquisa", pesquisa);

        return "admin/estoque";
    }

    @GetMapping("/admin/trocas")
    public String trocas(Model model) {
        model.addAttribute("paginaAtual", "trocas");
        return "admin/trocas";
    }

    @GetMapping("/admin/auditoria")
    public String auditoria(Model model) {
        model.addAttribute("paginaAtual", "Auditoria");
        model.addAttribute("auditorias", auditoriaService.listar());

        return "admin/auditoria";
    }
}