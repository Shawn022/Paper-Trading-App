package com.papertrading.backend.dto;

public class SellStockRequest {
    private String email;
    private String symbol;
    private Double quantity;
    private Double price;

    public String getEmail(){
        return email;
    }

    public String getSymbol(){
        return symbol;
    }

    public Double getQuantity(){
        return quantity;
    }

    public Double getPrice(){
        return price;
    }
}
