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
import java.util.ArrayList;
import java.util.List;

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

        //just gets current prices
        JsonNode meta = objectMapper.readTree(response)
                .path("chart")
                .path("result")
                .get(0)
                .path("meta");


        StockPriceResponse stock = new StockPriceResponse();

        stock.setSymbol(meta.path("symbol").asText());
        stock.setPrice(BigDecimal.valueOf(meta.path("regularMarketPrice").asDouble()));
        stock.setDayHigh(BigDecimal.valueOf(meta.path("regularMarketDayHigh").asDouble()));
        stock.setDayLow(BigDecimal.valueOf(meta.path("regularMarketDayLow").asDouble()));
        stock.setPreviousClose(BigDecimal.valueOf(meta.path("previousClose").asDouble()));
        stock.setVolume(meta.path("regularMarketVolume").asLong());

        return stock;
    }

    public StockPriceResponse getStockHistory(String symbol){

        String url = "https://query1.finance.yahoo.com/v8/finance/chart/"
                + symbol + "?range=3mo&interval=1d";

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

        String response = responseEntity.getBody();

        // Handle blocked response
        if (response == null || response.startsWith("<")) {
            System.out.println("oops1");
            throw new RuntimeException("Yahoo returned HTML (blocked)");
        }

        JsonNode root = objectMapper.readTree(response);

        JsonNode resultNode = root.path("chart").path("result");

        if (!resultNode.isArray() || resultNode.size() == 0) {
            System.out.println("oops2");
            throw new RuntimeException("No data found for symbol: " + symbol);
        }


        JsonNode result = resultNode.get(0);
        JsonNode meta = result.path("meta");

        JsonNode closeArray = result
                .path("indicators")
                .path("quote")
                .get(0)
                .path("close");

        List<BigDecimal> prices = new ArrayList<>();

        for (JsonNode priceNode : closeArray) {
            if (!priceNode.isNull()) {
                prices.add(BigDecimal.valueOf(priceNode.asDouble()));
            }
        }

        if (prices.isEmpty()) {
            throw new RuntimeException("No price history available");
        }


        StockPriceResponse stock = new StockPriceResponse();

        stock.setSymbol(symbol);
        stock.setPrice(BigDecimal.valueOf(meta.path("regularMarketPrice").asDouble()));
        stock.setDayHigh(BigDecimal.valueOf(meta.path("regularMarketDayHigh").asDouble()));
        stock.setDayLow(BigDecimal.valueOf(meta.path("regularMarketDayLow").asDouble()));
        stock.setVolume(meta.path("regularMarketVolume").asLong());
        stock.setPriceHistory(prices);


        return stock;
    }

}
