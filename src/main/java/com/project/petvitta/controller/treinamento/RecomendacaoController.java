package com.project.petvitta.controller.treinamento;

import com.project.petvitta.model.produto.Produto;
import com.project.petvitta.model.treinamento.ModeloVersao;
import com.project.petvitta.repository.treinamento.ModeloVersaoRepository;
import com.project.petvitta.service.treinamento.RecomendacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class RecomendacaoController {

    private final RecomendacaoService recomendacaoService;
    private final ModeloVersaoRepository versaoRepository;

    public RecomendacaoController(RecomendacaoService recomendacaoService, ModeloVersaoRepository versaoRepository) {
        this.recomendacaoService = recomendacaoService;
        this.versaoRepository = versaoRepository;
    }

    @PostMapping("/admin/api/treinamento/treinar")
    public ResponseEntity<?> treinar() {
        try {
            return ResponseEntity.ok(recomendacaoService.treinar());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao treinar o modelo: " + e.getMessage());
        }
    }

    @GetMapping("/admin/api/treinamento/treinar/versoes")
    public List<ModeloVersao> versoes() {
        return versaoRepository.findAll();
    }

}
