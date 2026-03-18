package com.papertrading.backend.service.stock;

import com.papertrading.backend.dto.stock.StockPriceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;

@Service
public class StockPriceService {

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public StockPriceResponse getStock(String symbol){

        String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol;

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0");
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        String response =  responseEntity.getBody();

        JsonNode meta = objectMapper.readTree(response)
                .path("chart")
                .path("result")
                .get(0)
                .path("meta");

        StockPriceResponse stock = new StockPriceResponse();

        stock.setSymbol(meta.path("symbol").asText());
        stock.setPrice(new BigDecimal(meta.path("regularMarketPrice").asText()));
        stock.setDayHigh(new BigDecimal(meta.path("regularMarketDayHigh").asText()));
        stock.setDayLow(new BigDecimal(meta.path("regularMarketDayLow").asText()));
        stock.setPreviousClose(new BigDecimal(meta.path("previousClose").asText()));
        stock.setVolume(meta.path("regularMarketVolume").asLong());

        return stock;
    }

}
