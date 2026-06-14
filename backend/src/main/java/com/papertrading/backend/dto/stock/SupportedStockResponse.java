package com.papertrading.backend.dto.stock;

import lombok.Getter;

@Getter
public class SupportedStockResponse {

    private String symbol;
    private String name;

    public SupportedStockResponse(
            String symbol,
            String name
    ) {
        this.symbol = symbol;
        this.name = name;
    }

}