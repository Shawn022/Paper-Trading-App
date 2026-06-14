package com.papertrading.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.papertrading.backend.trade.Trade;
import com.papertrading.backend.service.TradeService;

import com.papertrading.backend.dto.trade.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class TradeController {
    @Autowired
    private TradeService tradeService;

    @GetMapping("/trades")
    public List<GetTradeResponse> allTrades(Authentication authentication)
    {
        return tradeService.getAllTrades(authentication.getName());

    }

    @PostMapping("/trade/buy")
    public TradeResponse buyStock(@RequestBody BuyStockRequest request, Authentication authentication){
            return tradeService.buyStock(request,authentication.getName());

    }

    @PostMapping("/trade/sell")
    public TradeResponse sellStock(@RequestBody SellStockRequest request,Authentication authentication){
             return tradeService.sellStock(request,authentication.getName());
    }
}
