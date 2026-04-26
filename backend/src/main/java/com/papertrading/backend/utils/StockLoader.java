package com.papertrading.backend.utils;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class StockLoader {

    private List<String> symbols;

    @PostConstruct
    public void init() {
        this.symbols = loadStocks();
    }

    private List<String> loadStocks() {
        try {
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(
                            new ClassPathResource("stocks.txt").getInputStream()
                    )
            );

            return reader.lines()
                    .filter(line -> !line.isBlank())
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Failed to load stocks.txt", e);
        }
    }

    public List<String> getSymbols() {
        return symbols;
    }
}
