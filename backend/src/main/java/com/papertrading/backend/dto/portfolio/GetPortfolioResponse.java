package com.papertrading.backend.dto.portfolio;

import java.math.BigDecimal;

public interface GetPortfolioResponse {
    public Long getId();
    public String getStockSymbol();
    public BigDecimal getQuantity();
    public BigDecimal getAvgBuyPrice();
}
