package com.papertrading.backend.dto;

public class BuyStockRequest {
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
