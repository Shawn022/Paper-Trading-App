package com.papertrading.backend.websocket;

import com.papertrading.backend.dto.stock.Candle;
import com.papertrading.backend.dto.stock.CandleUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class PriceBroadcastService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void publish(String symbol, Candle candle) {

        CandleUpdate update =
                new CandleUpdate(
                        symbol,
                        candle);

        messagingTemplate.convertAndSend(
                "/topic/stocks/" + symbol,
                update
        );
    }
}
