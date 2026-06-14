package com.papertrading.backend.dto.portfolio;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
public class PortfolioResponse {
    private BigDecimal balance;
    private BigDecimal portfolioValue;
    private BigDecimal holdingsValue;
    private  BigDecimal realisedPnL;
    private BigDecimal unrealisedPnL;
    private BigDecimal unrealisedPnLPercent;
    private BigDecimal totalPnL;
    private BigDecimal totalPnLPercent;
    private List<Holding> holdings;


}
