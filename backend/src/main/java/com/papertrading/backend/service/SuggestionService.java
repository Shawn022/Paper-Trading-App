package com.papertrading.backend.service;

import com.papertrading.backend.dto.stock.StockPriceResponse;
import com.papertrading.backend.dto.stock.StockScoreDTO;
import com.papertrading.backend.service.stock.StockCacheService;
import com.papertrading.backend.service.stock.StockService;
import com.papertrading.backend.utils.StockRegistry;
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
     private StockRegistry stockRegistry;

     @Autowired
     private StockCacheService stockCacheService;


     public void cacheTopStocks(String type){
          List<String> allStocks = stockRegistry.getSymbols();
          List<StockScore> res = new ArrayList<>();

          MaxHeap heap =new MaxHeap();
          allStocks.forEach(symbol -> {
               StockPriceResponse stock = stockService.getStock(symbol);
               List<BigDecimal> prices = new ArrayList<>();
               if(type.equals("intraday")){
                    stock.getIntradayCandles().forEach(price -> prices.add(price.getClose()));
               }else if(type.equals("history")) {
                    stock.getHistoryCandles().forEach(price -> prices.add(price.getClose()));
               }else return;
               String name = stockRegistry.getName(symbol);
               heap.push(new StockScore(symbol,name,prices));
          } );
          int i=0;
          while(heap.size()> 0 && i<5){
               res.add(heap.pop());
               i++;
          }
          List<StockScoreDTO> data = new ArrayList<>();
          for(StockScore s:res){
               StockScoreDTO dto = new StockScoreDTO();

               dto.setName(s.getName());
               dto.setSymbol(s.getSymbol());
               dto.setRiskScore(s.getRiskScore());
               dto.setTrendScore(s.getTrendScore());
               dto.setWeightedScore(s.getWeightedScore());

               data.add(dto);
          }
          stockCacheService.putTopStocks(
                  "stock:top:" + type,
                  data
          );
     }

     public  List<StockScoreDTO> getTopStocks(String type){
          return stockCacheService.getTopStock("stock:top:"+type);
     }


     public BestBuySell getBestBuySellTiming(List<Double> arr, int k){
          return new BestBuySell(arr,k);
     }
}
