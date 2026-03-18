package com.papertrading.backend.dto.trade;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface GetTradeResponse {
    public Long getId();

    public String getStockSymbol();

    public String getType();

    public BigDecimal getQuantity();

    public BigDecimal getPrice();

    public LocalDateTime getTimestamp();
}
