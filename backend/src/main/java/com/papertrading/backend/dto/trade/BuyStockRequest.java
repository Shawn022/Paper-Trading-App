package com.papertrading.backend.dto.trade;

import java.math.BigDecimal;

public class BuyStockRequest {
    private String email;
    private String symbol;
    private BigDecimal quantity;
    private BigDecimal price;

    public String getEmail(){
        return email;
    }

    public String getSymbol(){
        return symbol;
    }

    public BigDecimal getQuantity(){
        return quantity;
    }

    public BigDecimal getPrice(){
        return price;
    }
}
