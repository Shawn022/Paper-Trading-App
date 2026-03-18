package com.papertrading.backend.service.stock;

import com.papertrading.backend.dto.stock.StockPriceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockScheduler {
    private final List<String> stocks = List.of(
            "RELIANCE.NS",
            "TCS.NS",
            "INFY.NS",
            "HDFCBANK.NS",
            "ICICIBANK.NS",
            "SBIN.NS",
            "ITC.NS",
            "LT.NS",
            "BHARTIARTL.NS",
            "KOTAKBANK.NS"
    );

    @Autowired
    private StockCache stockCache;

    @Autowired
    private StockPriceService stockPriceService;

    @Scheduled(fixedRate = 60000)
    public void updateStocks()throws InterruptedException{
        for(String symbol : stocks){
            StockPriceResponse stock = stockPriceService.getStock(symbol);

            stockCache.updateStock(stock);
            System.out.println(stock.getSymbol());

            Thread.sleep(300);
        }
    }
}
