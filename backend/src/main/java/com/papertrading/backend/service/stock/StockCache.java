package com.papertrading.backend.service.stock;

import com.papertrading.backend.DAA.CustomHashMap;
import com.papertrading.backend.dto.stock.StockPriceResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockCache {
    private CustomHashMap<String , StockPriceResponse> cache= new CustomHashMap<>();

    public void updateStock(StockPriceResponse stock) {
        cache.put(stock.getSymbol(), stock);
    }

    public StockPriceResponse getStock(String symbol) {
        return cache.get(symbol);
    }

    public List<StockPriceResponse> getAllStocks(){
        return cache.getAll();
    }
}
