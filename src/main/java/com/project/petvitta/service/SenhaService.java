package com.project.petvitta.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SenhaService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void validarSenha(
            String senha,
            String confirmarSenha
    ) {
        if (!senha.equals(confirmarSenha)) {
            throw new IllegalArgumentException(
                    "As senhas não coincidem."
            );
        }
    }

    public boolean verificarSenha(
            String senhaDigitada,
            String senhaCriptografada
    ) {
        return passwordEncoder.matches(
                senhaDigitada,
                senhaCriptografada
        );
    }

    public String criptografar(String senha) {
        return passwordEncoder.encode(senha);
    }
}