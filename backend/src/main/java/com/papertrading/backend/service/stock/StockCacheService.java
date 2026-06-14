package com.papertrading.backend.service.stock;

import com.papertrading.backend.customs.StockScore;
import com.papertrading.backend.dto.stock.Candle;
import com.papertrading.backend.dto.stock.StockScoreDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Service
public class StockCacheService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void setStockLoaded(){
        redisTemplate.opsForValue().set("system:stocks:loaded" , "true");
    }

    public boolean stockLoaded(){
        String val = redisTemplate.opsForValue().get("system:stocks:loaded");
        return "true".equals(val);
    }

    public List<Candle> getStock(String key) {

        try {

            String json =
                    redisTemplate.opsForValue().get(key);

            if(json == null) {
                return null;
            }

            return objectMapper.readValue(
                    json,
                    new TypeReference<List<Candle>>() {}
            );

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void putStock(
            String key,
            List<Candle> data
    ) {

        if (data == null || data.isEmpty()) {
            return;
        }

        try {
            if(isSynthetic(data.getLast())){
                data.removeLast();
            }

            String json =
                    objectMapper.writeValueAsString(data);

            redisTemplate.opsForValue()
                    .set(
                            key,
                            json
                    );

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public  void putTopStocks(
            String key,
            List<StockScoreDTO> data
    ){
        if (data == null || data.isEmpty()) {
            return;
        }

        try {

            String json =
                    objectMapper.writeValueAsString(data);

            redisTemplate.opsForValue()
                    .set(
                            key,
                            json
                    );

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<StockScoreDTO> getTopStock(String key) {

        try {
            String json =
                    redisTemplate.opsForValue().get(key);

            if(json == null) {
                return null;
            }

            return  objectMapper.readValue(
                    json,
                    new TypeReference<List<StockScoreDTO>>() {}
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private boolean isSynthetic(Candle candle) {

        return candle.getVolume() == 0
                && candle.getOpen().compareTo(candle.getHigh()) == 0
                && candle.getHigh().compareTo(candle.getLow()) == 0
                && candle.getLow().compareTo(candle.getClose()) == 0;
    }
}
