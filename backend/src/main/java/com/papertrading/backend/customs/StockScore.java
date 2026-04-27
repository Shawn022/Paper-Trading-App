package com.papertrading.backend.customs;

import java.math.BigDecimal;
import java.util.List;

public class StockScore {
    String symbol;
    double trendScore;
    double riskScore;
    double weightedScore;

    public StockScore(String symbol,  List<BigDecimal> priceHistory) {
        this.symbol = symbol;
        this.trendScore = calculateTrendScore(priceHistory);
        this.riskScore = calculateRiskScore(priceHistory);
        this.weightedScore = calculateScore();
    }

    private double calculateTrendScore(List<BigDecimal> priceHistory){
        if(priceHistory.size()<20)return 0;

        double shortMA = average(priceHistory , priceHistory.size()-10 , priceHistory.size());
        double longMA = average(priceHistory , priceHistory.size()-55 , priceHistory.size());

        if(longMA == 0)return 0;

        return ((shortMA - longMA) / longMA)*100;

    }

    private double calculateRiskScore(List<BigDecimal> priceHistory){
        if(priceHistory == null || priceHistory.size()<2) return 0;

        double mean = average(priceHistory,0,priceHistory.size());

        double variance =  0;
        for(BigDecimal price: priceHistory){
            double p = price.doubleValue();
            variance += Math.pow(p - mean,2);
        }
        variance = variance / priceHistory.size();

        double risk = Math.sqrt(variance);
        if(this.trendScore<0){
            risk = risk * 1.5;
        }
        return risk;
    }

    private double calculateScore(){
        double trendWeight = 0.7;
        double riskWeight = 0.3;

        return (trendWeight * this.trendScore) - (riskWeight * this.riskScore);
    }

    private double average(List<BigDecimal> prices , int start, int end){
        double sum=0;
        for(int i=start;i<end;i++){
            sum += prices.get(i).doubleValue();
        }
        return sum / (end-start);
    }

    public String getSymbol(){return symbol;}
    public double getRiskScore(){return riskScore;}
    public double getTrendScore(){return trendScore;}
    public double getWeightedScore(){return weightedScore;}

}
