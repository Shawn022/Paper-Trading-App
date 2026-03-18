package com.papertrading.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.papertrading.backend.service.stock.StockCache;
import com.papertrading.backend.dto.stock.StockPriceResponse;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@RestController
@RequestMapping("api/stock")
public class StockController {
    @Autowired
    private StockCache stockCache;

    @GetMapping("/{symbol}")
    public BigDecimal getStock(@PathVariable String symbol){
        StockPriceResponse stock=  stockCache.getStock(symbol);
        if(stock == null){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND
            );
        }
        return stock.getPrice();
    }

}
