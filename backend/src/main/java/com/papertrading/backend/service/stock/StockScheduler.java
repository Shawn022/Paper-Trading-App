package com.papertrading.backend.service.stock;

import com.papertrading.backend.dto.stock.Candle;
import com.papertrading.backend.service.SuggestionService;
import com.papertrading.backend.utils.StockRegistry;
import com.papertrading.backend.websocket.PriceBroadcastService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class StockScheduler {
    @Autowired
    private StockRegistry stockRegistry;

    @Autowired
    private StockCacheService stockCacheService;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private  MarketHoursService marketHoursService;

    @Autowired
    private PriceBroadcastService priceBroadcastService;

    @Autowired
    private SuggestionService suggestionService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void onStartup() {

        System.out.println("Server restarted → syncing stock state");

        stockRegistry.getSymbols().parallelStream().forEach(symbol -> {
            List<Candle> candles = fetchIntraday(symbol);

            stockCacheService.putStock("stock:intraday:" + symbol, candles);

            priceBroadcastService.publish(symbol, candles.getLast());
        });
        stockRegistry.getSymbols().parallelStream().forEach(symbol -> {
            List<Candle> candles = fetchHistory(symbol);

            stockCacheService.putStock("stock:history:" + symbol, candles);

            priceBroadcastService.publish(symbol, candles.getLast());
        });

        suggestionService.cacheTopStocks("intraday");
        suggestionService.cacheTopStocks("history");

        stockCacheService.setStockLoaded();
        System.out.println("Initial Setup Completed");
    }

    @Scheduled(fixedRate = 60000)
    public void updateIntraday() {

        if(!marketHoursService.isMarketOpen() || !stockCacheService.stockLoaded()){
            return;
        }

        stockRegistry.getSymbols().parallelStream().forEach(symbol -> {
            List<Candle> candles = fetchIntraday(symbol);

            stockCacheService.putStock("stock:intraday:" + symbol, candles);

            if(!isSynthetic(candles.getLast())){
                priceBroadcastService.publish(symbol, candles.getLast());
            }
        });
        System.out.println("Intraday Prices Fetched");
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void updateHistory() {

        stockRegistry.getSymbols().parallelStream().forEach(symbol -> {
            List<Candle> candles = fetchHistory(symbol);

            stockCacheService.putStock("stock:history:" + symbol, candles);

            priceBroadcastService.publish(symbol, candles.getLast());
        });

        System.out.println("Historical Prices Fetched");
    }

    @Scheduled(fixedRate = 60 * 60000)
    public void setTopStocksIntraday(){
        if(!stockCacheService.stockLoaded())
            return;
        suggestionService.cacheTopStocks("intraday");
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void setTopStocksHistorical(){
        if(!stockCacheService.stockLoaded())
            return;
        suggestionService.cacheTopStocks("history");
    }

    //helper function to create list of candles
    private List<Candle> parseCandles(String response) throws Exception {

        JsonNode root = objectMapper.readTree(response);

        JsonNode result = root
                .path("chart")
                .path("result")
                .get(0);

        JsonNode timestamps = result.path("timestamp");

        JsonNode quote = result
                .path("indicators")
                .path("quote")
                .get(0);

        JsonNode opens = quote.path("open");
        JsonNode highs = quote.path("high");
        JsonNode lows = quote.path("low");
        JsonNode closes = quote.path("close");
        JsonNode volumes = quote.path("volume");

        List<Candle> candles = new ArrayList<>();

        for (int i = 0; i < timestamps.size(); i++) {

            if (closes.get(i).isNull()) continue; // skip bad data

            Candle c = new Candle();

            c.setTimestamp(timestamps.get(i).asLong());
            c.setOpen(
                    new BigDecimal(opens.get(i).asText())
                            .setScale(2, RoundingMode.HALF_UP)
            );
            c.setHigh(
                    new BigDecimal(highs.get(i).asText())
                            .setScale(2, RoundingMode.HALF_UP)
            );
            c.setLow(
                    new BigDecimal(lows.get(i).asText())
                            .setScale(2, RoundingMode.HALF_UP)
            );
            c.setClose(
                    new BigDecimal(closes.get(i).asText())
                            .setScale(2, RoundingMode.HALF_UP)
            );
            c.setVolume(volumes.get(i).asLong());

            candles.add(c);
        }

        return candles;
    }

    private List<Candle> fetchIntraday(String symbol) {

        try {
            String url = "https://query1.finance.yahoo.com/v8/finance/chart/"
                    + symbol + "?range=1d&interval=1m";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            return parseCandles(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch intraday for " + symbol, e);
        }
    }

    private List<Candle> fetchHistory(String symbol) {

        try {
            String url = "https://query1.finance.yahoo.com/v8/finance/chart/"
                    + symbol + "?range=90d&interval=1d";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            return parseCandles(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch history for " + symbol, e);
        }
    }

    private boolean isSynthetic(Candle candle) {

        return candle.getVolume() == 0
                && candle.getOpen().compareTo(candle.getHigh()) == 0
                && candle.getHigh().compareTo(candle.getLow()) == 0
                && candle.getLow().compareTo(candle.getClose()) == 0;
    }
}
