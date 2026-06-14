package com.papertrading.backend.service.stock;

import com.papertrading.backend.dto.stock.Candle;
import com.papertrading.backend.dto.stock.StockPriceResponse;
import com.papertrading.backend.utils.StockRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class StockService {
    @Autowired
    private StockCacheService stockCacheService;

    @Autowired
    private StockRegistry stockRegistry;

    public StockPriceResponse getStock(String symbol) {

        List<Candle> intraday = stockCacheService.getStock("stock:intraday:" + symbol);
        List<Candle> history = stockCacheService.getStock("stock:history:" + symbol);

        if (intraday == null || history == null) {
            throw new RuntimeException("Data not available yet");
        }

        return buildResponse(symbol, intraday, history);
    }

    private StockPriceResponse buildResponse(String symbol,
                                             List<Candle> intraday,
                                             List<Candle> history) {

        StockPriceResponse res = new StockPriceResponse();

        BigDecimal price = getCurrentPrice(intraday).getClose();
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
        res.setName(stockRegistry.getName(symbol));
        res.setPrice(price);
        res.setPreviousClose(previousClose);
        res.setDayHigh(dayHigh);
        res.setDayLow(dayLow);
        res.setVolume(volume);
        res.setChange(change);
        res.setChangePercent(changePercent);
        res.setLastUpdated(System.currentTimeMillis());

        res.setIntradayCandles(intraday);
        res.setHistoryCandles(history);

        return res;
    }

    private Candle getCurrentPrice(List<Candle> candles) {
        return candles.getLast();
    }

    public Candle getCurrentMarketPrice(String symbol){
        List<Candle> intraday = stockCacheService.getStock("stock:intraday:" + symbol);
        return getCurrentPrice(intraday);
    }

}
