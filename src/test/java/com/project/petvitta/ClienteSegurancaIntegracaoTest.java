package com.project.petvitta;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ClienteSegurancaUnitTest {

    private static final String SENHA_ORIGINAL = "Sophia123@";

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    @Test
    void deveCriptografarESerCapazDeValidarSenha() {
        // Criptografa a senha.
        String senhaCriptografada =
                passwordEncoder.encode(SENHA_ORIGINAL);

        // A senha não deve ser armazenada em texto puro.
        assertNotEquals(
                SENHA_ORIGINAL,
                senhaCriptografada
        );

        // A senha original deve corresponder ao hash.
        assertTrue(
                passwordEncoder.matches(
                        SENHA_ORIGINAL,
                        senhaCriptografada
                )
        );

        // Uma senha incorreta deve ser rejeitada.
        assertFalse(
                passwordEncoder.matches(
                        "SenhaErrada123@",
                        senhaCriptografada
                )
        );
    }

    @Test
    void deveGerarCodigosDeClienteValidosEDistintos() {
        // Gera dois códigos de exemplo.
        String codigo1 = gerarCodigo();
        String codigo2 = gerarCodigo();

        // Verifica se os códigos foram gerados.
        assertNotNull(codigo1);
        assertNotNull(codigo2);

        // Verifica o formato de seis caracteres.
        assertEquals(6, codigo1.length());
        assertEquals(6, codigo2.length());

        // Verifica se são compostos por letras e números.
        assertTrue(codigo1.matches("[A-Za-z0-9]{6}"));
        assertTrue(codigo2.matches("[A-Za-z0-9]{6}"));

        // Verifica se os códigos são distintos.
        assertNotEquals(codigo1, codigo2);
    }

    private String gerarCodigo() {
        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 6)
                .toUpperCase();
    }
}