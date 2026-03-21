package com.papertrading.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/{userId}/trades")
    public List<GetTradeResponse> allTrades(@PathVariable long userId){
        return tradeService.getAllTrades(userId);
    }

    @PostMapping("/{userId}/trade/buy")
    public ResponseEntity<String> buyStock(@RequestBody BuyStockRequest request,@PathVariable long userId){
        try {
            tradeService.buyStock(request,userId);
            return ResponseEntity.ok("Stock purchased");
        } catch (ResponseStatusException ex) {
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(ex.getReason());
        }
    }

    @PostMapping("/{userId}/trade/sell")
    public ResponseEntity<String> sellStock(@RequestBody SellStockRequest request,@PathVariable long userId){
         try{
             tradeService.sellStock(request,userId);
             return ResponseEntity.ok("Stock sold");
         }catch (ResponseStatusException ex){
             return ResponseEntity
                     .status(ex.getStatusCode())
                     .body(ex.getReason());
         }
    }
}
