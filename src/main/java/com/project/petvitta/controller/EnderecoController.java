package com.project.petvitta.controller;

import com.project.petvitta.dto.EnderecoDTO;
import com.project.petvitta.service.EnderecoService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class EnderecoController {

    private final EnderecoService enderecoService;

    public EnderecoController(
            EnderecoService enderecoService
    ) {
        this.enderecoService = enderecoService;
    }

    @PostMapping("/cliente/adicionar-endereco")
    public String adicionar(
            @Valid @ModelAttribute("endereco") EnderecoDTO dto,
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

            enderecoService.adicionar(
                    6L,
                    dto
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Endereço adicionado com sucesso!"
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

    @PostMapping("/cliente/editar-endereco")
    public String editar(
            @Valid @ModelAttribute("endereco") EnderecoDTO dto,
            BindingResult result,
            @RequestParam Long enderecoId,
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

            enderecoService.editar(
                    6L,
                    enderecoId,
                    dto
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Endereço alterado com sucesso!"
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

    @PostMapping("/cliente/excluir-endereco")
    public String excluir(
            @RequestParam Long enderecoId,
            RedirectAttributes redirectAttributes
    ) {

        try {

            enderecoService.excluir(
                    6L,
                    enderecoId
            );

            redirectAttributes.addFlashAttribute(
                    "tipoToast",
                    "sucesso"
            );

            redirectAttributes.addFlashAttribute(
                    "mensagemToast",
                    "Endereço excluído com sucesso!"
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