package com.papertrading.backend.service.stock;

import com.papertrading.backend.dto.stock.Candle;
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
import java.util.ArrayList;
import java.util.List;

@Service
public class StockScheduler {
    private final List<String> stocks = List.of(
            "HDFCBANK.NS","ICICIBANK.NS","SBIN.NS","AXISBANK.NS","KOTAKBANK.NS",
            "BAJFINANCE.NS","BAJAJFINSV.NS","HDFCLIFE.NS","SBILIFE.NS","INDUSINDBK.NS",
            "TCS.NS","INFY.NS","HCLTECH.NS","WIPRO.NS","TECHM.NS",
            "RELIANCE.NS","ONGC.NS","NTPC.NS","POWERGRID.NS","BPCL.NS","COALINDIA.NS",
            "HINDUNILVR.NS","ITC.NS","NESTLEIND.NS","BRITANNIA.NS","TATACONSUM.NS",
            "MARUTI.NS","M&M.NS","EICHERMOT.NS","BAJAJ-AUTO.NS","HEROMOTOCO.NS",
            "SUNPHARMA.NS","DRREDDY.NS","CIPLA.NS","DIVISLAB.NS","APOLLOHOSP.NS",
            "TATASTEEL.NS","JSWSTEEL.NS","HINDALCO.NS","ULTRACEMCO.NS","GRASIM.NS",
            "ADANIENT.NS","ADANIPORTS.NS","LT.NS",
            "TITAN.NS","TRENT.NS","ASIANPAINT.NS","SBICARD.NS"
    );

    @Autowired
    private StockCacheService stockCacheService;

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Scheduled(fixedRate = 60000)
    public void updateIntraday() {

        for (String symbol : stocks) {
            List<Candle> candles = fetchIntraday(symbol);

            stockCacheService.put(
                    "stock:intraday:" + symbol,
                    candles,
                    60000
            );


        }
        System.out.println("Intraday Prices Fetched");
    }

    @Scheduled(fixedRate = 6 * 60 * 60 * 1000)
    public void updateHistory() {

        for (String symbol : stocks) {
            List<Candle> candles = fetchHistory(symbol);

            stockCacheService.put(
                    "stock:history:" + symbol,
                    candles,
                    12 * 60 * 60 * 1000
            );

        }
        System.out.println("Historical Prices Fetched");
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
            c.setOpen(new BigDecimal(opens.get(i).asText()));
            c.setHigh(new BigDecimal(highs.get(i).asText()));
            c.setLow(new BigDecimal(lows.get(i).asText()));
            c.setClose(new BigDecimal(closes.get(i).asText()));
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
                    + symbol + "?range=60d&interval=1d";

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
}
