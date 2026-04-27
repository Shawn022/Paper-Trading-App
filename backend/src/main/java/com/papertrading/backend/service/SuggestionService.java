package com.papertrading.backend.service;

import com.papertrading.backend.dto.stock.StockPriceResponse;
import com.papertrading.backend.service.stock.StockService;
import com.papertrading.backend.utils.StockLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.papertrading.backend.customs.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class SuggestionService {
     @Autowired
     private StockService stockService;

     @Autowired
     private StockLoader stockLoader;


     public List<StockScore> getTopStocks(String type){
          List<String> allStocks = stockLoader.getSymbols();
          List<StockScore> res = new ArrayList<>();

          MaxHeap heap =new MaxHeap();
          allStocks.forEach(symbol -> {
               StockPriceResponse stock = stockService.getStock(symbol);
               List<BigDecimal> prices = new ArrayList<>();
               if(type.equals("intraday")){
                    stock.getIntradayCandles().forEach(price -> prices.add(price.getClose()));
               }else {
                    stock.getHistoricalCandles().forEach(price -> prices.add(price.getClose()));
               }
               heap.push(new StockScore(symbol,prices));
          } );
          int i=0;
          while(heap.size()> 0 && i<5){
               res.add(heap.pop());
               i++;
          }
          return res;
     };

     public BestBuySell getBestBuySellTiming(List<Double> arr, int k){
          return new BestBuySell(arr,k);
     }
}
