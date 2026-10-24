package com.project.petvitta.controller;

import com.project.petvitta.dto.RetornoEstoqueDTO;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.model.produto.VariacaoProduto;
import com.project.petvitta.model.troca.Troca;
import com.project.petvitta.service.*;
import com.project.petvitta.service.cliente.ClienteService;
import com.project.petvitta.service.pedido.PedidoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.List;

@Controller
public class AdminController {

    private final ClienteService clienteService;
    private final ProdutoService produtoService;
    private final PedidoService pedidoService;
    private final AuditoriaService auditoriaService;
    private final TrocaService trocaService;

    public AdminController(
            ClienteService clienteService,
            ProdutoService produtoService,
            PedidoService pedidoService,
            AuditoriaService auditoriaService, TrocaService trocaService
    ) {
        this.clienteService = clienteService;
        this.produtoService = produtoService;
        this.pedidoService = pedidoService;
        this.auditoriaService = auditoriaService;
        this.trocaService = trocaService;
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

    @PostMapping("/admin/login")
    public String realizarLogin(
            @RequestParam String email,
            @RequestParam String senha,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        if ("admin@petvittaclub.com".equals(email) && "@Admin123".equals(senha)) {
            session.setAttribute("perfil", "ADMIN");
            return "redirect:/admin/dashboard";
        }

        redirectAttributes.addFlashAttribute(
                "tipoToast",
                "erro"
        );

        redirectAttributes.addFlashAttribute(
                "mensagemToast",
                "E-mail ou senha incorretos. Verifique os dados e tente novamente."
        );

        return "redirect:/admin/login";
    }

    @GetMapping("/admin/dashboard")
    public String dashboard(
            Model model,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        String perfil = (String) session.getAttribute("perfil");

        if (!"ADMIN".equals(perfil)) {
            return "redirect:/admin/login";
        }

        model.addAttribute("paginaAtual", "dashboard");

        int ano = LocalDate.now().getYear();

        LocalDate dataInicio = LocalDate.of(ano, 1, 1);
        LocalDate dataFim = LocalDate.of(ano, 12, 31);

        model.addAttribute("dataInicio", dataInicio);
        model.addAttribute("dataFim", dataFim);

        try {
            model.addAttribute(
                    "dadosVendas", pedidoService.listarVendasPorCategoria(dataInicio, dataFim)
            );
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute(
                    "mensagemToast", e.getMessage()
            );
            redirectAttributes.addFlashAttribute(
                    "tipoToast", "erro"
            );

            return "redirect:/admin/dashboard";
        }

        return "admin/dashboard";
    }

    @PostMapping("/admin/dashboard/aplicar-datas")
    public String filtrarDashboard(
            @RequestParam LocalDate dataInicio,
            @RequestParam LocalDate dataFim,
            Model model,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        String perfil = (String) session.getAttribute("perfil");

        if (!"ADMIN".equals(perfil)) {
            return "redirect:/admin/login";
        }

        model.addAttribute("paginaAtual", "dashboard");
        model.addAttribute("dataInicio", dataInicio);
        model.addAttribute("dataFim", dataFim);

        try {
            model.addAttribute("dadosVendas", pedidoService.listarVendasPorCategoria(dataInicio, dataFim));
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute(
                    "mensagemToast", e.getMessage()
            );
            redirectAttributes.addFlashAttribute(
                    "tipoToast", "erro"
            );

            return "redirect:/admin/dashboard";
        }

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

        List<Pedido> pedidos = pedidoService.listarPorCliente(cliente.getId());

        model.addAttribute("pedidos", pedidos);

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

        model.addAttribute("paginaAtual", "estoque");

        List<VariacaoProduto> variacoes = produtoService.filtrarEstoque(status, pesquisa);

        model.addAttribute("variacoes", variacoes);

        model.addAttribute("statusSelecionado", status);
        model.addAttribute("pesquisa", pesquisa);

        return "admin/estoque";
    }

    @GetMapping("/admin/trocas")
    public String trocas(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String pesquisa,
            Model model) {
        model.addAttribute("paginaAtual", "trocas");

        List<Troca> trocas = trocaService.filtrarTroca(status, pesquisa);

        model.addAttribute("trocas", trocas);

        model.addAttribute("statusSelecionado", status);
        model.addAttribute("pesquisa", pesquisa);

        return "admin/trocas";
    }

    @PostMapping("/admin/trocas/status")
    public String alterarStatusTroca(
            @RequestParam Long trocaId,
            @RequestParam String descricao,
            RedirectAttributes redirectAttributes) {

        trocaService.alterarStatus(trocaId, descricao);

        redirectAttributes.addFlashAttribute(
                "tipoToast",
                "sucesso"
        );

        redirectAttributes.addFlashAttribute(
                "mensagemToast",
                "Status alterado com sucesso!"
        );

        return "redirect:/admin/trocas";
    }

    @PostMapping("/admin/trocas/voltar-estoque")
    public String voltarEstoque(
            @ModelAttribute RetornoEstoqueDTO dto,
            RedirectAttributes redirectAttributes) {

        try {
            Cupom cupom = trocaService.retornoItens(dto);

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Troca finalizada com sucesso! Cupom de Troca gerado: R$ "
                            + cupom.getValor()
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast", "sucesso");

        } catch (IllegalArgumentException e) {

            redirectAttributes.addFlashAttribute(
                    "mensagemToast", e.getMessage());

            redirectAttributes.addFlashAttribute(
                    "tipoToast", "erro");
        }

        return "redirect:/admin/trocas";
    }

    @GetMapping("/admin/auditoria")
    public String auditoria(Model model) {
        model.addAttribute("paginaAtual", "Auditoria");
        model.addAttribute("auditorias", auditoriaService.listar());

        return "admin/auditoria";
    }

    @GetMapping("/admin/sair")
    public String logout(HttpSession session) {

        session.invalidate();

        return "redirect:/admin/login";
    }
}