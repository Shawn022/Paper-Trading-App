package com.papertrading.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.papertrading.backend.trade.Trade;
import com.papertrading.backend.service.TradeService;

import com.papertrading.backend.dto.BuyStockRequest;
import com.papertrading.backend.dto.SellStockRequest;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class TradeController {
    @Autowired
    private TradeService tradeService;

    @GetMapping("/{userId}/trades")
    public List<Trade> allTrades(@PathVariable long userId){
        return tradeService.getAllTrades(userId);
    }

    @PostMapping("/trade/buy")
    public ResponseEntity<String> buyStock(@RequestBody BuyStockRequest request){
        try {
            tradeService.buyStock(request);
            return ResponseEntity.ok("Stock purchased");
        } catch (ResponseStatusException ex) {
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(ex.getReason());
        }
    }

    @PostMapping("/trade/sell")
    public ResponseEntity<String> sellStock(@RequestBody SellStockRequest request){
         try{
             tradeService.sellStock(request);
             return ResponseEntity.ok("Stock sold");
         }catch (ResponseStatusException ex){
             return ResponseEntity
                     .status(ex.getStatusCode())
                     .body(ex.getReason());
         }
    }
}
