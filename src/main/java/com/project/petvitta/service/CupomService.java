package com.project.petvitta.service;

import com.project.petvitta.model.cliente.Cupom;
import com.project.petvitta.repository.cliente.CupomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CupomService {

    private final CupomRepository cupomRepository;

    public CupomService(CupomRepository cupomRepository) {
        this.cupomRepository = cupomRepository;
    }

    public List<Cupom> listarCupoms() {
        return cupomRepository.findAll();
    }

}
