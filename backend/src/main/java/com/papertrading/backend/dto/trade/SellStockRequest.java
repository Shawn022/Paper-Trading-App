package com.papertrading.backend.dto.trade;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class SellStockRequest {
    private String symbol;
    private BigDecimal quantity;

}
