package com.project.petvitta.controller;

import com.project.petvitta.dto.*;
import com.project.petvitta.model.carrinho.Carrinho;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.model.cliente.Endereco;
import com.project.petvitta.model.pedido.CartaoTemporario;
import com.project.petvitta.model.pedido.EnderecoTemporario;
import com.project.petvitta.model.pedido.Pedido;
import com.project.petvitta.service.*;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
public class ClienteController {

    private final ClienteService clienteService;
    private final EnderecoService enderecoService;
    private final CartaoService cartaoService;
    private final ProdutoService produtoService;
    private final CupomService cupomService;
    private final CarrinhoService carrinhoService;
    private final PedidoService pedidoService;

    public ClienteController(
            ClienteService clienteService,
            EnderecoService enderecoService,
            CartaoService cartaoService,
            ProdutoService produtoService,
            CupomService cupomService,
            CarrinhoService carrinhoService,
            PedidoService pedidoService
    ) {
        this.clienteService = clienteService;
        this.enderecoService = enderecoService;
        this.cartaoService = cartaoService;
        this.produtoService = produtoService;
        this.cupomService = cupomService;
        this.carrinhoService = carrinhoService;
        this.pedidoService = pedidoService;
    }

    @ModelAttribute
    public void carregarDadosCadastro(Model model) {

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
                enderecoService.listarTiposEndereco()
        );

        model.addAttribute(
                "tiposResidencia",
                enderecoService.listarTiposResidencia()
        );

        model.addAttribute(
                "tiposLogradouro",
                enderecoService.listarTiposLogradouro()
        );

        model.addAttribute(
                "estados",
                enderecoService.listarEstados()
        );

        model.addAttribute(
                "bandeiras",
                cartaoService.listarBandeiras()
        );
    }

    @GetMapping("/cliente/login")
    public String login() {
        return "cliente/login";
    }

    @GetMapping("/cliente/cadastrar")
    public String cadastrar(Model model) {

        model.addAttribute(
                "cliente",
                new ClienteCadastroDTO()
        );

        return "cliente/cadastrar";
    }

    @PostMapping("/cliente/cadastrar")
    public String cadastrar(
            @Valid
            @ModelAttribute("cliente") ClienteCadastroDTO dto,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes
    ) {

        if (result.hasErrors()) {

            model.addAttribute(
                    "tipoToast",
                    "erro"
            );

            model.addAttribute(
                    "mensagemToast",
                    result.getFieldError().getDefaultMessage()
            );

            return "cliente/cadastrar";
        }

        try {

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

        } catch (IllegalArgumentException e) {

            model.addAttribute(
                    "tipoToast",
                    "erro"
            );

            model.addAttribute(
                    "mensagemToast",
                    e.getMessage()
            );

            return "cliente/cadastrar";
        }
    }

    @GetMapping("/cliente/perfil")
    public String perfil(Model model) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        model.addAttribute(
                "cliente",
                cliente
        );

        model.addAttribute(
                "enderecos",
                cliente.getEnderecos()
        );

        model.addAttribute(
                "cartoes",
                cliente.getCartoes()
        );

        model.addAttribute(
                "cupons",
                cupomService.listarCupoms()
        );

        return "cliente/perfil";
    }

    @PostMapping("/cliente/alterar")
    public String alterar(
            @Valid ClienteEdicaoDTO dto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        if (result.hasErrors()) {

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    result.getFieldError().getDefaultMessage()
            );

            return "redirect:/cliente/perfil";
        }

        try {

            clienteService.alterar(1L, dto);

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Dados salvos com sucesso!"
            );

            return "redirect:/cliente/perfil";

        } catch (IllegalArgumentException e) {

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    e.getMessage()
            );

            return "redirect:/cliente/perfil";
        }
    }

    @PostMapping("/cliente/alterar-senha")
    public String alterarSenha(
            @Valid AlterarSenhaDTO dto,
            BindingResult result,
            RedirectAttributes redirectAttributes
    ) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        if (result.hasErrors()) {

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    result.getFieldError().getDefaultMessage()
            );

            return "redirect:/cliente/perfil";
        }

        try {

            clienteService.alterarSenha(1L, dto);

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Senha alterada com sucesso!"
            );

        } catch (IllegalArgumentException e) {

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    e.getMessage()
            );
        }

        return "redirect:/cliente/perfil";
    }

    @GetMapping("/cliente/finalizar-compra")
    public String finalizarCompra(
            @RequestParam(required = false) List<Long> itensSelecionados,
            Model model,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        if (itensSelecionados == null || itensSelecionados.isEmpty()) {
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Selecione pelo menos um produto."
            );

            return "redirect:/cliente/carrinho";
        }

        Cliente cliente = clienteService.buscarPorId(1L);

        Carrinho carrinho =
                carrinhoService.buscarPorCliente(cliente.getId());

        if (carrinho == null ||
                carrinho.getItens() == null ||
                carrinho.getItens().isEmpty()) {

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Seu carrinho está vazio."
            );

            return "redirect:/cliente/carrinho";
        }

        carrinhoService.verificarExpiracao(carrinho);

        Long enderecoTemporarioId =
                (Long) session.getAttribute("enderecoTemporarioId");

        EnderecoTemporario enderecoTemporario = null;

        if (enderecoTemporarioId != null) {

            EnderecoTemporario enderecoTemp =
                    enderecoService.buscarTemporarioPorId(
                            enderecoTemporarioId
                    );

            if (enderecoTemp != null &&
                    ("Entrega".equalsIgnoreCase(
                            enderecoTemp.getTipoEndereco().getDescricao()) ||
                            "Cobrança e Entrega".equalsIgnoreCase(
                                    enderecoTemp.getTipoEndereco().getDescricao()))) {

                enderecoTemporario = enderecoTemp;
            }
        }

        model.addAttribute(
                "enderecoTemporario",
                enderecoTemporario
        );

        Endereco endereco = null;

        Long enderecoSelecionadoId =
                (Long) session.getAttribute("enderecoSelecionadoId");

        if (enderecoSelecionadoId != null &&
                cliente.getEnderecos() != null) {

            for (Endereco enderecoAtual : cliente.getEnderecos()) {

                if (enderecoAtual.getId().equals(enderecoSelecionadoId) &&
                        "Entrega".equalsIgnoreCase(
                                enderecoAtual.getTipoEndereco().getDescricao())) {

                    endereco = enderecoAtual;
                    break;
                }
            }
        }

        if (endereco == null &&
                cliente.getEnderecos() != null &&
                !cliente.getEnderecos().isEmpty()) {

            for (Endereco enderecoAtual : cliente.getEnderecos()) {

                if ("Entrega".equalsIgnoreCase(enderecoAtual.getTipoEndereco().getDescricao()) ||
                        "Cobrança e Entrega".equalsIgnoreCase(enderecoAtual.getTipoEndereco().getDescricao())) {

                    endereco = enderecoAtual;
                    break;
                }
            }
        }

        List<Cupom> cupons =
                cupomService.listarCupoms();

        model.addAttribute(
                "itensSelecionados",
                itensSelecionados
        );


        CartaoTemporario cartaoTemporario = null;

        Long cartaoTemporarioId =
                (Long) session.getAttribute("cartaoTemporarioId");

        if (cartaoTemporarioId != null) {
            cartaoTemporario =
                    cartaoService.buscarPorId(cartaoTemporarioId);
        }


        model.addAttribute("cliente", cliente);
        model.addAttribute("carrinho", carrinho);
        model.addAttribute("cartaoTemporario", cartaoTemporario);

        model.addAttribute(
                "cliente",
                cliente
        );

        model.addAttribute(
                "carrinho",
                carrinho
        );

        model.addAttribute("endereco", endereco);

        if (endereco != null) {
            model.addAttribute("enderecoSelecionadoId", endereco.getId());
        }

        model.addAttribute("cupons", cupons);


        return "cliente/finalizar-compra";
    }

    @PostMapping("/cliente/finalizar-compra")
    public String finalizarCompra(
            @Valid FinalizarCompraDTO dto,
            BindingResult result,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        if (result.hasErrors()) {

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    result.getFieldError()
                            .getDefaultMessage()
            );

            return "redirect:/cliente/finalizar-compra";
        }

        try {

            Long clienteId = 1L;

            /*
             * O DTO já deve possuir:
             *
             * enderecoId
             * valoresCartoes
             * itensSelecionados
             * cuponsIds
             *
             * Não existe mais nenhum temporário.
             */
            pedidoService.finalizarCompra(
                    clienteId,
                    dto
            );

            /*
             * Remove somente a seleção do endereço
             * depois que o pedido foi criado.
             */
// Limpa os dados da compra da sessão
            session.removeAttribute("enderecoSelecionadoId");
            session.removeAttribute("enderecoTemporarioId");
            session.removeAttribute("cartaoTemporarioId");

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Compra realizada com sucesso!"
            );

            return "redirect:/cliente/pedido";

        } catch (IllegalArgumentException e) {

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    e.getMessage()
            );

            redirectAttributes.addAttribute(
                    "itensSelecionados",
                    dto.getItensSelecionados()
            );

            return "redirect:/cliente/finalizar-compra";
        }
    }

    @GetMapping("/cliente/pedido")
    public String pedidos(
            @RequestParam(required = false) String codigo,
            Model model) {

        Cliente cliente = clienteService.buscarPorId(1L);

        List<Pedido> pedidos;

        if (codigo != null && !codigo.isBlank()) {
            pedidos = pedidoService.buscarPorCodigo(codigo, cliente.getId());
        } else {
            pedidos = pedidoService.listarPorCliente(cliente.getId());
        }

        model.addAttribute("pedidos", pedidos);
        model.addAttribute("codigoPesquisa", codigo);

        return "cliente/pedido";
    }

    @GetMapping("/cliente/notificacao")
    public String notificacao(Model model) {

        if (!verificarClienteAtivo()) {
            return "redirect:/cliente/inativo";
        }

        return "cliente/notificacao";
    }

    @GetMapping("/cliente/inativo")
    public String inativo(Model model) {

        Cliente cliente =
                clienteService.buscarPorId(1L);

        model.addAttribute(
                "cliente",
                cliente
        );

        return "cliente/inativo";
    }

    @GetMapping("/cliente/sair")
    public String sair() {
        return "cliente/login";
    }

    private boolean verificarClienteAtivo() {

        Long clienteId = 1L;

        return clienteService.clienteAtivo(
                clienteId
        );
    }
}
