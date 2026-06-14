package com.papertrading.backend.dto.stock;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class StockScoreDTO {
    private String symbol;
    private String name;
    private double trendScore;
    private double riskScore;
    private double weightedScore;

    // --- Getters and Setters ---

}
