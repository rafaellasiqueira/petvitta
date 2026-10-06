package com.project.petvitta.service;

import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.repository.cliente.CupomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CupomService {

    private final CupomRepository cupomRepository;

    public CupomService(CupomRepository cupomRepository) {
        this.cupomRepository = cupomRepository;
    }

    public List<Cupom> listarCupoms() {
        List<Cupom> cupons = cupomRepository.findAll();

        for (int i = 0; i < cupons.size(); i++) {
            Cupom cupom = cupons.get(i);

            if (cupom.getValidade().isBefore(LocalDate.now())) {
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

}