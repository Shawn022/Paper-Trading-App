package com.papertrading.backend.dto.stock;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandleUpdate {

    private String symbol;

    private Candle candle;
}
