package com.papertrading.backend.dto.stock;

import java.math.BigDecimal;
import java.util.List;


public class StockPriceResponse {

    private String symbol;

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
    private List<Candle> historicalCandles;

    // Getters and Setters

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDayHigh() {
        return dayHigh;
    }

    public void setDayHigh(BigDecimal dayHigh) {
        this.dayHigh = dayHigh;
    }

    public BigDecimal getDayLow() {
        return dayLow;
    }

    public void setDayLow(BigDecimal dayLow) {
        this.dayLow = dayLow;
    }

    public BigDecimal getPreviousClose() {
        return previousClose;
    }

    public void setPreviousClose(BigDecimal previousClose) {
        this.previousClose = previousClose;
    }

    public Long getVolume() {
        return volume;
    }

    public void setVolume(Long volume) {
        this.volume = volume;
    }

    public BigDecimal getChange() {
        return change;
    }

    public void setChange(BigDecimal change) {
        this.change = change;
    }

    public BigDecimal getChangePercent() {
        return changePercent;
    }

    public void setChangePercent(BigDecimal changePercent) {
        this.changePercent = changePercent;
    }

    public Long getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Long lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public List<Candle> getIntradayCandles() {
        return intradayCandles;
    }

    public void setIntradayCandles(List<Candle> intradayCandles) {
        this.intradayCandles = intradayCandles;
    }

    public List<Candle> getHistoricalCandles() {
        return historicalCandles;
    }

    public void setHistoricalCandles(List<Candle> historicalCandles) {
        this.historicalCandles = historicalCandles;
    }
}
