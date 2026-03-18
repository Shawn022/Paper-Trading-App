package com.papertrading.backend.DAA;

public class StockScore {
    String symbol;
    double trendScore;
    double riskScore;
    double weightedScore;

    public StockScore(String symbol, double trendScore, double riskScore, double weightedScore) {
        this.symbol = symbol;
        this.trendScore = trendScore;
        this.riskScore = riskScore;
        this.weightedScore = weightedScore;
    }
}
