package com.papertrading.backend.service.stock;

import com.papertrading.backend.dto.stock.StockPriceResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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

    @PostConstruct
    public void loadInitialData() {
        System.out.println("Loading initial stock data...");

        for (String symbol : stocks) {
            try {
                StockPriceResponse data = stockPriceService.getStockHistory(symbol);
                stockCache.updateStock(data);
            } catch (Exception e) {
                System.out.println("Failed for: " + symbol);
            }
        }

        System.out.println("Initial data loaded ✅");
    }

    @Scheduled(fixedRate = 60000)
    public void updateStocks()throws InterruptedException{
        for(String symbol : stocks){
            StockPriceResponse stock = stockPriceService.getStock(symbol);

            StockPriceResponse old = (stockCache.getStock(symbol));
            if(old !=null){
                stock.setPriceHistory(old.getPriceHistory());
            }

            stockCache.updateStock(stock);
            System.out.println(stock.getSymbol());

            Thread.sleep(200);
        }
    }
}
