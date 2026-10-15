package com.project.petvitta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class PetvittaApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetvittaApplication.class, args);
	}

}
