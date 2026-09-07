package com.project.petvitta.exception;

import org.springframework.web.bind.annotation.ControllerAdvice; import org.springframework.web.bind.annotation.ExceptionHandler; import org.springframework.web.servlet.mvc.support.RedirectAttributes; @ControllerAdvice
public class TratamentoGlobalErro {
    @ExceptionHandler(IllegalArgumentException.class)
    public String tratarIllegalArgumentException( IllegalArgumentException e, RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute( "tipoToast", "erro" );
        redirectAttributes.addFlashAttribute( "mensagemToast", e.getMessage() );
        return "redirect:/cliente/cadastrar";
    }
}
