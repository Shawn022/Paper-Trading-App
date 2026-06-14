package com.papertrading.backend.websocket;

import com.papertrading.backend.dto.stock.Candle;
import com.papertrading.backend.service.stock.StockCacheService;
import com.papertrading.backend.utils.StockRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ws")
public class WebSocketTest {

    @Autowired
    private StockRegistry stockRegistry;

    @Autowired
    private StockCacheService stockCacheService;

    @Autowired
    private PriceBroadcastService priceBroadcastService;

    @GetMapping("/test")
    public void testWebSocket(){
        for (String symbol : stockRegistry.getSymbols()) {
            List<Candle> candles = stockCacheService.getStock("stock:intraday:" + symbol);

            Candle c = candles.getLast();
            c.setTimestamp(c.getTimestamp() + 60);

            priceBroadcastService.publish(
                    symbol,
                    c
            );

        }
    }

}
