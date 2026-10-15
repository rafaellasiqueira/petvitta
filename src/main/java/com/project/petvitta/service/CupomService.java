package com.project.petvitta.service;

import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.model.dominio.TipoCupom;
import com.project.petvitta.repository.cliente.CupomRepository;
import com.project.petvitta.repository.dominio.TipoCupomRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CupomService {

    private final CupomRepository cupomRepository;
    private final TipoCupomRepository tipoCupomRepository;

    public CupomService(CupomRepository cupomRepository, TipoCupomRepository tipoCupomRepository) {
        this.cupomRepository = cupomRepository;
        this.tipoCupomRepository = tipoCupomRepository;
    }

    public List<Cupom> listarCupoms() {
        List<Cupom> cupons = cupomRepository.findAll();

        for (int i = 0; i < cupons.size(); i++) {
            Cupom cupom = cupons.get(i);

            if (cupom.getValidade().isBefore(LocalDateTime.now())) {
                cupom.setAtivo(false);
                cupomRepository.save(cupom);
            }
        }

        List<Cupom> cuponsAtivos = new ArrayList<>();

        for (int i = 0; i < cupons.size(); i++) {
            Cupom cupom = cupons.get(i);

            if (cupom.isAtivo()) {
                cuponsAtivos.add(cupom);
            }
        }

        return cuponsAtivos;
    }

    public List<Cupom> buscarCupons(List<Long> cuponsIds) {
        if (cuponsIds == null || cuponsIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<Cupom> cupons = new ArrayList<>();

        int promocionais = 0;

        for (int i = 0; i < cuponsIds.size(); i++) {
            Cupom cupom = cupomRepository.findById(cuponsIds.get(i))
                    .orElseThrow(() -> new IllegalArgumentException("Cupom não encontrado."));

            if (!cupom.isAtivo()) {
                throw new IllegalArgumentException(
                        "O cupom " + cupom.getCodigo() + " não está disponível."
                );
            }

            if (cupom.getValidade().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException(
                        "O cupom " + cupom.getCodigo() + " está vencido."
                );
            }

            if ("Promocional".equalsIgnoreCase(cupom.getTipoCupom().getNome())) {
                promocionais++;
            }
            cupons.add(cupom);
        }

        if (promocionais > 1) {
            throw new IllegalArgumentException(
                    "Apenas um cupom promocional pode ser utilizado por compra."
            );
        }

        return cupons;
    }

    public BigDecimal calcularDesconto(List<Cupom> cupons) {

        BigDecimal desconto = BigDecimal.ZERO;

        for (int i = 0; i < cupons.size(); i++) {
            desconto = desconto.add(cupons.get(i).getValor());
        }

        return desconto;
    }

    public void removerCuponsUsados(List<Cupom> cupons) {

        for (int i = 0; i < cupons.size(); i++) {
            Cupom cupom = cupons.get(i);

            cupom.setAtivo(false);

            cupomRepository.save(cupom);
        }
    }

    public void gerarCupomTroca(BigDecimal valor, HttpSession session) {
        Cupom cupom = new Cupom();

        cupom.setCodigo(
                "TROCA - " + String.valueOf(System.currentTimeMillis()).substring(
                        String.valueOf(System.currentTimeMillis()).length() - 5
                )
        );

        cupom.setValor(valor);
        cupom.setValidade(LocalDateTime.now().plusDays(120));

        TipoCupom tipoTroca = tipoCupomRepository.findById(2L)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de cupom não encontrado."));

        cupom.setTipoCupom(tipoTroca);

        cupomRepository.save(cupom);

        session.setAttribute("cupomTrocaGerado", cupom.getCodigo());
    }

}