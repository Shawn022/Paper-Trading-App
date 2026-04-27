package com.papertrading.backend.controller;

import com.papertrading.backend.customs.BestBuySell;
import com.papertrading.backend.dto.stock.Candle;
import com.papertrading.backend.service.SuggestionService;
import com.papertrading.backend.service.stock.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.papertrading.backend.customs.StockScore;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/suggestion")
public class SuggestionController {
    @Autowired
    private SuggestionService suggestionService;
    @Autowired
    private StockService stockService;

    @GetMapping("/top-intraday")
    private List<StockScore> getTopIntraday(){
        return suggestionService.getTopStocks("intraday");
    }

    @GetMapping("/top-historical")
    private List<StockScore> getTopHistorical(){
        return suggestionService.getTopStocks("historical");
    }

    @GetMapping("/BestBuySell/intraday")
    private BestBuySell getBestBuySellResultI(@RequestParam String symbol,@RequestParam int k){
        List<Double> nums = new ArrayList<>();
        List<Candle> candles = stockService.getStock(symbol).getIntradayCandles();
        candles.forEach(candle -> {
            nums.add( candle.getClose().doubleValue() );
        });
        return suggestionService.getBestBuySellTiming(nums,k);
    }

    @GetMapping("/BestBuySell/historical")
    private BestBuySell getBestBuySellResultH(@RequestParam String symbol,@RequestParam int k){
        List<Double> nums = new ArrayList<>();
        List<Candle> candles = stockService.getStock(symbol).getHistoricalCandles();
        candles.forEach(candle -> {
            nums.add( candle.getClose().doubleValue() );
        });
        return suggestionService.getBestBuySellTiming(nums,k);
    }
}
