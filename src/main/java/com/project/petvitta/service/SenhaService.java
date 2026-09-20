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
            throw new IllegalArgumentException("As senhas não coincidem.");
        }
    }

    public void verificarSenha(
            String senhaDigitada,
            String senhaCriptografada
    ) {
        if (!passwordEncoder.matches(senhaDigitada, senhaCriptografada)) {
            throw new IllegalArgumentException("A senha atual está incorreta.");
        }
    }

    public String criptografar(String senha) {
        return passwordEncoder.encode(senha);
    }
}