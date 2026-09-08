package com.project.petvitta.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SenhaService {

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public void validarSenha(
            String senha,
            String confirmarSenha
    ) {

        if (senha == null || senha.isEmpty()) {
            throw new IllegalArgumentException(
                    "Preencha a senha."
            );
        }

        if (confirmarSenha == null || confirmarSenha.isEmpty()) {
            throw new IllegalArgumentException(
                    "Confirme a senha."
            );
        }

        if (!senha.equals(confirmarSenha)) {
            throw new IllegalArgumentException(
                    "As senhas não coincidem."
            );
        }

        if (senha.length() < 8) {
            throw new IllegalArgumentException(
                    "A senha deve ter pelo menos 8 caracteres."
            );
        }

        if (!senha.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException(
                    "A senha deve ter pelo menos uma letra maiúscula."
            );
        }

        if (!senha.matches(".*[a-z].*")) {
            throw new IllegalArgumentException(
                    "A senha deve ter pelo menos uma letra minúscula."
            );
        }

        if (!senha.matches(".*[^A-Za-z0-9].*")) {
            throw new IllegalArgumentException(
                    "A senha deve ter pelo menos um caractere especial."
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