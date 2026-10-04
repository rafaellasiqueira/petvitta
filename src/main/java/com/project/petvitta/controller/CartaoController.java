package com.project.petvitta.controller;

import com.project.petvitta.dto.CartaoDTO;
import com.project.petvitta.model.pedido.CartaoTemporario;
import com.project.petvitta.service.CartaoService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
public class CartaoController {
    private final CartaoService cartaoService;

    public CartaoController(
            CartaoService cartaoService
    ) {
        this.cartaoService = cartaoService;
    }

    @PostMapping("/cliente/adicionar-cartao")
    public String adicionar(
            @Valid CartaoDTO dto,
            BindingResult result,
            @RequestParam(required = false) String voltarPara,
            @RequestParam(required = false) List<Long> itensSelecionados,
            RedirectAttributes redirectAttributes
    ) {
        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    result.getFieldError().getDefaultMessage()
            );

            if ("finalizar-compra".equals(voltarPara)) {
                redirectAttributes.addAttribute(
                        "itensSelecionados",
                        itensSelecionados
                );

                return "redirect:/cliente/finalizar-compra";
            } else {
                return "redirect:/cliente/perfil";
            }
        }

        try {
            cartaoService.adicionar(1L, dto);

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Cartão adicionado com sucesso!"
            );

            if ("finalizar-compra".equals(voltarPara)) {
                redirectAttributes.addAttribute(
                        "itensSelecionados",
                        itensSelecionados
                );

                return "redirect:/cliente/finalizar-compra";
            } else {
                return "redirect:/cliente/perfil";
            }

        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    e.getMessage()
            );

            if ("finalizar-compra".equals(voltarPara)) {
                redirectAttributes.addAttribute(
                        "itensSelecionados",
                        itensSelecionados
                );

                return "redirect:/cliente/finalizar-compra";
            } else {
                return "redirect:/cliente/perfil";
            }
        }
    }

    @PostMapping("/cliente/adicionar-cartao-temporario")
    public String adicionarTemporario(
            @Valid CartaoDTO dto,
            BindingResult result,
            @RequestParam(required = false) List<Long> itensSelecionados,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        if (result.hasErrors()) {
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "erro"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    result.getFieldError().getDefaultMessage()
            );

            return "redirect:/cliente/finalizar-compra";
        }

        try {
            CartaoTemporario cartaoTemporario =
                    cartaoService.adicionarTemporario(1L, dto);

            session.setAttribute(
                    "cartaoTemporarioId",
                    cartaoTemporario.getId()
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Cartão adicionado com sucesso!"
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

        redirectAttributes.addAttribute(
                "itensSelecionados",
                itensSelecionados
        );

        return "redirect:/cliente/finalizar-compra";
    }

    @PostMapping("/cliente/tornar-cartao-preferencial/{id}")
    public String tornarPreferencial(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes
    ) {
        try {
            cartaoService.tornarPreferencial(1L, id);
            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Cartão definido como preferencial."
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

    @PostMapping("/cliente/excluir-cartao/{id}")
    public String excluir(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes
    ) {
        try {
            cartaoService.excluirCartao(1L, id);

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Cartão excluído com sucesso!"
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
}