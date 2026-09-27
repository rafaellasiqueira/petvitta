package com.project.petvitta.repository.produto;

import com.project.petvitta.model.produto.Petisco;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetiscoRepository extends JpaRepository<Petisco, Long> {
}
