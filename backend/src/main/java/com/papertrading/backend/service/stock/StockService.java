package com.papertrading.backend.service.stock;

import com.papertrading.backend.dto.stock.Candle;
import com.papertrading.backend.dto.stock.StockPriceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class StockService {
    @Autowired
    private StockCacheService cacheService;

    public StockPriceResponse getStock(String symbol) {

        List<Candle> intraday = cacheService.get("stock:intraday:" + symbol);
        List<Candle> history = cacheService.get("stock:history:" + symbol);

        if (intraday == null || history == null) {
            throw new RuntimeException("Data not available yet");
        }

        return buildResponse(symbol, intraday, history);
    }

    private StockPriceResponse buildResponse(String symbol,
                                             List<Candle> intraday,
                                             List<Candle> history) {

        StockPriceResponse res = new StockPriceResponse();

        BigDecimal price = getCurrentPrice(intraday);
        BigDecimal previousClose = history.get(history.size() - 1).getClose();

        BigDecimal dayHigh = intraday.stream()
                .map(Candle::getHigh)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal dayLow = intraday.stream()
                .map(Candle::getLow)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        long volume = intraday.stream()
                .mapToLong(Candle::getVolume)
                .sum();

        BigDecimal change = price.subtract(previousClose);

        BigDecimal changePercent = change
                .divide(previousClose, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        res.setSymbol(symbol);
        res.setPrice(price);
        res.setPreviousClose(previousClose);
        res.setDayHigh(dayHigh);
        res.setDayLow(dayLow);
        res.setVolume(volume);
        res.setChange(change);
        res.setChangePercent(changePercent);
        res.setLastUpdated(System.currentTimeMillis());

        res.setIntradayCandles(intraday);
        res.setHistoricalCandles(history);

        return res;
    }

    private BigDecimal getCurrentPrice(List<Candle> candles) {
        for (int i = candles.size() - 1; i >= 0; i--) {
            if (candles.get(i).getClose() != null) {
                return candles.get(i).getClose()
                        .setScale(2, RoundingMode.HALF_UP);
            }
        }
        throw new RuntimeException("No valid price");
    }

    public BigDecimal getCurrentPriceOnly(String symbol){
        List<Candle> intraday = cacheService.get("stock:intraday:" + symbol);
        return getCurrentPrice(intraday);
    }

}
