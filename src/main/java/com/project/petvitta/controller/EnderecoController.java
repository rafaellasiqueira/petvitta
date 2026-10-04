package com.project.petvitta.controller;

import com.project.petvitta.dto.EnderecoDTO;
import com.project.petvitta.model.pedido.EnderecoTemporario;
import com.project.petvitta.service.EnderecoService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

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
            @Valid EnderecoDTO dto,
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
            }

            return "redirect:/cliente/perfil";
        }

        try {
            enderecoService.adicionar(1L, dto);

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

        if ("finalizar-compra".equals(voltarPara)) {
            redirectAttributes.addAttribute(
                    "itensSelecionados",
                    itensSelecionados
            );

            return "redirect:/cliente/finalizar-compra";
        }

        return "redirect:/cliente/perfil";
    }

    @PostMapping("/cliente/adicionar-endereco-temporario")
    public String adicionarTemporario(
            @Valid EnderecoDTO dto,
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

            redirectAttributes.addAttribute(
                    "itensSelecionados",
                    itensSelecionados
            );

            return "redirect:/cliente/finalizar-compra";
        }

        try {

            EnderecoTemporario endereco =
                    enderecoService.adicionarTemporario(
                            1L,
                            dto
                    );

            session.setAttribute(
                    "enderecoTemporarioId",
                    endereco.getId()
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

        redirectAttributes.addAttribute(
                "itensSelecionados",
                itensSelecionados
        );

        return "redirect:/cliente/finalizar-compra";
    }

    @PostMapping("/cliente/editar-endereco/{id}")
    public String editar(
            @Valid EnderecoDTO dto,
            BindingResult result,
            @PathVariable Long id,
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
            }

            return "redirect:/cliente/perfil";
        }

        try {
            enderecoService.editar(1L, id, dto);

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

        if ("finalizar-compra".equals(voltarPara)) {
            redirectAttributes.addAttribute(
                    "itensSelecionados",
                    itensSelecionados
            );

            return "redirect:/cliente/finalizar-compra";
        }

        return "redirect:/cliente/perfil";
    }

    @PostMapping("/cliente/excluir-endereco/{id}")
    public String excluir(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes
    ) {
        try {
            enderecoService.excluir(1L, id);
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

    @PostMapping("/cliente/finalizar-compra/endereco")
    public String selecionarEndereco(
            @RequestParam(required = false) Long enderecoId,
            @RequestParam(required = false) Long enderecoTemporarioId,
            @RequestParam List<Long> itensSelecionados,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        if (enderecoId != null) {
            session.setAttribute(
                    "enderecoSelecionadoId",
                    enderecoId
            );

            session.removeAttribute(
                    "enderecoTemporarioId"
            );
        }

        if (enderecoTemporarioId != null) {
            session.setAttribute(
                    "enderecoTemporarioId",
                    enderecoTemporarioId
            );

            session.removeAttribute(
                    "enderecoSelecionadoId"
            );
        }

        redirectAttributes.addAttribute(
                "itensSelecionados",
                itensSelecionados
        );

        return "redirect:/cliente/finalizar-compra";
    }
}

