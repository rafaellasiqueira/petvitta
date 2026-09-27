package com.project.petvitta.repository.cliente;

import com.project.petvitta.model.cliente.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
}