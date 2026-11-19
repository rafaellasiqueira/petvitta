package com.project.petvitta.repository.produto;

import com.project.petvitta.model.produto.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByAtivoTrue();
}