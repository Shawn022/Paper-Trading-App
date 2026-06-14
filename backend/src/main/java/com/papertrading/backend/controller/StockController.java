package com.papertrading.backend.controller;

import com.papertrading.backend.dto.stock.Candle;
import com.papertrading.backend.dto.stock.StockPriceResponse;
import com.papertrading.backend.dto.stock.SupportedStockResponse;
import com.papertrading.backend.utils.StockRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.papertrading.backend.service.stock.StockService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("api/stock")
public class StockController {
    @Autowired
    private StockService stockService;

    @Autowired
    private StockRegistry stockRegistry;

    @GetMapping("/supported")
    public List<SupportedStockResponse> getSupportedStocks(){
        return stockRegistry.getSupportedStocks();
    }

    @GetMapping("/{symbol}")
    private Candle getCurrentPriceOnly(@PathVariable String symbol){
        return stockService.getCurrentMarketPrice(symbol);
    }

    @GetMapping("/{symbol}/history")
    private StockPriceResponse getCurrentPrice(@PathVariable String symbol){
        return stockService.getStock(symbol);
    }

}
