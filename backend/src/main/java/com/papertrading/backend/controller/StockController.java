package com.papertrading.backend.controller;

import com.papertrading.backend.dto.stock.StockPriceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.papertrading.backend.service.stock.StockService;

import java.math.BigDecimal;

@RestController
@RequestMapping("api/stock")
public class StockController {
    @Autowired
    private StockService stockService;

    @GetMapping("/{symbol}")
    private BigDecimal getCurrentPriceOnly(@PathVariable String symbol){
        return stockService.getCurrentPriceOnly(symbol);
    }

    @GetMapping("/{symbol}/history")
    private StockPriceResponse getCurrentPrice(@PathVariable String symbol){
        return stockService.getStock(symbol);
    }


}
