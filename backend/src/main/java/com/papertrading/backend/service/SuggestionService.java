package com.papertrading.backend.service;

import com.papertrading.backend.dto.stock.StockPriceResponse;
import com.papertrading.backend.service.stock.StockCacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.papertrading.backend.customs.*;

import java.util.ArrayList;
import java.util.List;

@Service
public class SuggestionService {
     @Autowired
     private StockCacheService stockCacheService;

     /*
     public List<StockScore> getTopStocks(){
          List<StockPriceResponse> allStocks = stockCacheService.getAllStocks();
          List<StockScore> res = new ArrayList<>();

          MaxHeap heap =new MaxHeap();
          allStocks.forEach(stock -> {
               heap.push( new StockScore(stock.getSymbol() , stock.getPriceHistory()) );
          } );
          int i=0;
          while(heap.size()> 0 && i<5){
               res.add(heap.pop());
               i++;
          }
          return res;
     };*/
}
