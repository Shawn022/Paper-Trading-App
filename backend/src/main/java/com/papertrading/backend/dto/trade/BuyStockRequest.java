package com.papertrading.backend.dto.trade;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class BuyStockRequest {
    private String symbol;
    private BigDecimal quantity;

}
