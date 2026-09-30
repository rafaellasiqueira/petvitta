package com.project.petvitta.repository.carrinho;

import com.project.petvitta.model.carrinho.Carrinho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarrinhoRepository extends JpaRepository<Carrinho, Long> {

    Optional<Carrinho> findByClienteId(Long clienteId);
}