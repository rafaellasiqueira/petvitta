package com.project.petvitta.exception;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class TratamentoErro {

    @ExceptionHandler(IllegalArgumentException.class)
    public String tratarErroNegocio(IllegalArgumentException e, Model model) {
        model.addAttribute("mensagemErro", e.getMessage());
        return "erro";
    }

    @ExceptionHandler(Exception.class)
    public String tratarErroGeral(Exception e, Model model) {
        model.addAttribute("mensagemErro", "Ocorreu um erro inesperado.");
        return "erro";
    }
}