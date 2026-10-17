package com.project.petvitta.service.pedido;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class FreteService {

    public BigDecimal calcularFrete(int quantidadeItens, String siglaEstado) {
        BigDecimal frete = BigDecimal.ZERO;

        if (quantidadeItens >= 3 && quantidadeItens < 6) {
            frete = frete.add(new BigDecimal("4.00"));
        }

        if (quantidadeItens >= 6) {
            frete = frete.add(new BigDecimal("8.00"));
        }

        if ("SP".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("7.00"));
        } else if ("RJ".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("8.00"));
        } else if ("MG".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("8.00"));
        } else if ("ES".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("10.00"));
        } else if ("PR".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("10.00"));
        } else if ("SC".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("12.00"));
        } else if ("MS".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("12.00"));
        } else if ("GO".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("13.00"));
        } else if ("RS".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("15.00"));
        } else if ("DF".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("15.00"));
        } else if ("MT".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("16.00"));
        } else if ("BA".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("18.00"));
        } else if ("SE".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("19.00"));
        } else if ("AL".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("20.00"));
        } else if ("PE".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("21.00"));
        } else if ("PB".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("22.00"));
        } else if ("RN".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("23.00"));
        } else if ("CE".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("24.00"));
        } else if ("PI".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("24.00"));
        } else if ("MA".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("25.00"));
        } else if ("TO".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("25.00"));
        } else if ("PA".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("28.00"));
        } else if ("RO".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("30.00"));
        } else if ("AC".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("32.00"));
        } else if ("AM".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("35.00"));
        } else if ("AP".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("35.00"));
        } else if ("RR".equalsIgnoreCase(siglaEstado)) {
            frete = frete.add(new BigDecimal("38.00"));
        }

        return frete;
    }
}
