package com.papertrading.backend.dto.trade;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class TradeResponse {
    private String symbol;
    private BigDecimal quantity;
    private BigDecimal price;
    private String type;

    public TradeResponse(String symbol, BigDecimal quantity, BigDecimal price, String type) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
        this.type = type;
    }


}
