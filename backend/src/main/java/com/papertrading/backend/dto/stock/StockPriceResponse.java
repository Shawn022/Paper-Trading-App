package com.papertrading.backend.dto.stock;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;


@Setter
@Getter
public class StockPriceResponse {

    private String symbol;
    private String name;

    //current price info
    private BigDecimal price;
    private BigDecimal dayHigh;
    private BigDecimal dayLow;
    private BigDecimal previousClose;
    private Long volume;

    //change from last price
    private BigDecimal change;
    private BigDecimal changePercent;
    private Long lastUpdated;

    //historical prices
    private List<Candle> intradayCandles;
    private List<Candle> historyCandles;

    // Getters and Setters

}
