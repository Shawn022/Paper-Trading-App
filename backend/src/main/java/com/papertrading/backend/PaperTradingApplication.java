package com.papertrading.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PaperTradingApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaperTradingApplication.class, args);
	}

}
