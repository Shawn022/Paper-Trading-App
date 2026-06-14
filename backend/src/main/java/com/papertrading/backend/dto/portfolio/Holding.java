package com.papertrading.backend.dto.portfolio;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class Holding {

    private String symbol;
    private BigDecimal quantity;
    private BigDecimal avgBuyPrice;
    private BigDecimal currentPrice;
    private BigDecimal positionValue;
    private BigDecimal unrealisedPnL;

    public Holding() {
    }

    public Holding(String symbol,
                   BigDecimal quantity,
                   BigDecimal avgBuyPrice,
                   BigDecimal currentPrice,
                   BigDecimal positionValue,
                   BigDecimal unrealisedPnL) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.avgBuyPrice = avgBuyPrice;
        this.currentPrice = currentPrice;
        this.positionValue = positionValue;
        this.unrealisedPnL = unrealisedPnL;
    }

}