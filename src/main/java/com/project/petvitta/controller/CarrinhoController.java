package com.project.petvitta.controller;

import com.project.petvitta.model.carrinho.Carrinho;
import com.project.petvitta.model.carrinho.ItemCarrinho;
import com.project.petvitta.model.chat.Conversa;
import com.project.petvitta.model.chat.Mensagem;
import com.project.petvitta.model.cliente.Cliente;
import com.project.petvitta.service.CarrinhoService;
import com.project.petvitta.service.chat.ConversaService;
import com.project.petvitta.service.cliente.ClienteService;
import com.project.petvitta.service.cliente.NotificacaoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
public class CarrinhoController {
    private final CarrinhoService carrinhoService;
    private final ClienteService clienteService;
    private final NotificacaoService notificacaoService;
    private final ConversaService conversaService;

    public CarrinhoController(CarrinhoService carrinhoService, ClienteService clienteService, NotificacaoService notificacaoService, ConversaService conversaService) {
        this.carrinhoService = carrinhoService;
        this.clienteService = clienteService;
        this.notificacaoService = notificacaoService;
        this.conversaService = conversaService;
    }

    @PostMapping("/cliente/carrinho/adicionar")
    public String adicionarCarrinho(
            @RequestParam List<Long> variacaoId,
            @RequestParam List<Integer> quantidade,
            @RequestParam(required = false) Long produtoId,
            @RequestParam String origem,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        String perfil = (String) session.getAttribute("perfil");

        if (!"CLIENTE".equals(perfil)) {
            return "redirect:/cliente/login";
        }

        try {
            for (int i = 0; i < variacaoId.size(); i++) {
                carrinhoService.adicionar(variacaoId.get(i), quantidade.get(i));
            }

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Produto adicionado ao carrinho com sucesso!"
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

        if (origem.equals("detalhes")) {
            return "redirect:/cliente/detalhes-produto/" + produtoId;
        } else if (origem.equals("expirados")) {
            return "redirect:/cliente/carrinho";
        }

        return "redirect:/cliente/produtos";
    }

    @PostMapping("/cliente/carrinho/limpar-carrinho")
    public String limparCarrinho(
            Long carrinhoId,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {

        String perfil = (String) session.getAttribute("perfil");

        if (!"CLIENTE".equals(perfil)) {
            return "redirect:/cliente/login";
        }

        try {
            carrinhoService.limparCarrinho(carrinhoId);
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

        return "redirect:/cliente/carrinho";
    }

    @PostMapping("/cliente/carrinho/excluir/{id}")
    public String excluir(
            @PathVariable Long id,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {

        String perfil = (String) session.getAttribute("perfil");

        if (!"CLIENTE".equals(perfil)) {
            return "redirect:/cliente/login";
        }

        try {
            carrinhoService.excluirItem(id);

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Item excluído do carrinho!"
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
        return "redirect:/cliente/carrinho";
    }

    @GetMapping("/cliente/carrinho")
    public String carrinho(
            Model model,
            HttpSession session) {

        String perfil = (String) session.getAttribute("perfil");

        if (!"CLIENTE".equals(perfil)) {
            return "redirect:/cliente/login";
        }

        Long clienteId = (Long) session.getAttribute("clienteId");

        Cliente cliente = clienteService.buscarPorId(clienteId);

        Conversa conversa = conversaService.buscarOuCriar(clienteId);

        List<Mensagem> mensagens = conversaService.buscarUltimasMensagens(conversa.getId());

        model.addAttribute("mensagens", mensagens);

        boolean temNotificacaoNaoLida = notificacaoService.temNotificacaoNaoLida(clienteId);
        model.addAttribute("temNotificacaoNaoLida", temNotificacaoNaoLida);

        Carrinho carrinho = carrinhoService.buscarPorCliente(cliente.getId());
        List<ItemCarrinho> itensExpirados = carrinhoService.verificarExpiracao(carrinho);

        boolean avisoExpiracao = false;

        if (carrinho != null && carrinho.getDataExpiracao() != null) {
            avisoExpiracao = carrinhoService.verificarAvisoExpiracao(carrinho);
        }

        model.addAttribute("carrinho", carrinho);
        model.addAttribute("itensExpirados", itensExpirados);
        model.addAttribute("avisoExpiracao", avisoExpiracao);

        return "cliente/carrinho";
    }

    @PostMapping("/cliente/carrinho/quantidade")
    public String alterarQuantidade(
            @RequestParam Long itemId,
            @RequestParam Integer quantidade,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        String perfil = (String) session.getAttribute("perfil");

        if (!"CLIENTE".equals(perfil)) {
            return "redirect:/cliente/login";
        }

        try {
            carrinhoService.alterarQuantidade(itemId, quantidade);

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

        return "redirect:/cliente/carrinho";
    }

    @PostMapping("/cliente/carrinho/tamanho")
    public String alterarTamanho(
            @RequestParam Long itemId,
            @RequestParam Long variacaoId,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        String perfil = (String) session.getAttribute("perfil");

        if (!"CLIENTE".equals(perfil)) {
            return "redirect:/cliente/login";
        }

        try {
            carrinhoService.alterarTamanho(itemId, variacaoId);
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

        return "redirect:/cliente/carrinho";
    }

}