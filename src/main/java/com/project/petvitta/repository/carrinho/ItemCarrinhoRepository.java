package com.project.petvitta.repository.carrinho;

import com.project.petvitta.model.carrinho.ItemCarrinho;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {
}