package com.project.petvitta.controller;

import com.project.petvitta.dto.CartaoDTO;
import com.project.petvitta.service.CartaoService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
            @Valid @ModelAttribute("cartao") CartaoDTO dto,
            BindingResult result,
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

            return "redirect:/cliente/perfil";
        }

        try {

            cartaoService.adicionar(
                    6L,
                    dto
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Cartão adicionado com sucesso."
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

    @PostMapping("/cliente/tornar-cartao-preferencial")
    public String tornarPreferencial(
            @RequestParam Long cartaoId,
            RedirectAttributes redirectAttributes
    ) {

        try {

            cartaoService.tornarPreferencial(
                    6L,
                    cartaoId
            );

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

    @PostMapping("/cliente/excluir-cartao")
    public String excluir(
            @RequestParam Long cartaoId,
            RedirectAttributes redirectAttributes
    ) {

        try {

            cartaoService.excluirCartao(6L, cartaoId);

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Cartão excluído com sucesso."
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