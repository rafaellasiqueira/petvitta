package com.project.petvitta.controller.teste;

import com.project.petvitta.model.carrinho.Carrinho;
import com.project.petvitta.repository.carrinho.CarrinhoRepository;
import com.project.petvitta.service.CarrinhoService;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;

@Controller
@Profile("test")
public class TesteController {

    private final CarrinhoRepository carrinhoRepository;
    private final CarrinhoService carrinhoService;

    public TesteController(
            CarrinhoRepository carrinhoRepository,
            CarrinhoService carrinhoService) {
        this.carrinhoRepository = carrinhoRepository;
        this.carrinhoService = carrinhoService;
    }

    @PostMapping("/teste/carrinho/{id}/expirar")
    public String expirarCarrinho(
            @PathVariable Long id) {

        Carrinho carrinho = carrinhoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Carrinho não encontrado"));

        carrinho.setDataExpiracao(LocalDateTime.now().plusSeconds(5));
        carrinhoRepository.save(carrinho);

        carrinhoService.verificarExpiracao(carrinho);

        return "redirect:/cliente/carrinho";
    }

    @PostMapping("/teste/carrinho/{id}/aviso")
    public String simularAviso(
            @PathVariable Long id) {

        Carrinho carrinho = carrinhoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Carrinho não encontrado"));

        carrinho.setDataExpiracao(LocalDateTime.now().plusSeconds(5));
        carrinhoRepository.save(carrinho);

        return "redirect:/cliente/carrinho";
    }
}