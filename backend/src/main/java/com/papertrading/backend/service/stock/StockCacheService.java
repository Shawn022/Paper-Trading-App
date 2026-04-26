package com.papertrading.backend.service.stock;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import com.papertrading.backend.dto.stock.Candle;
import org.springframework.stereotype.Service;

@Service
public class StockCacheService {
    private ConcurrentHashMap<String , CacheEntry> cache = new ConcurrentHashMap<>();

    public List<Candle> get(String key) {
        CacheEntry entry = cache.get(key);

        if (entry != null && !entry.isExpired()) {
            return entry.getData();
        }

        cache.remove(key);
        return null;
    }

    public void put(String key, List<Candle> data, long ttlMillis) {
        CacheEntry entry = new CacheEntry();
        entry.setData(data);
        entry.setExpiryTime(System.currentTimeMillis() + ttlMillis);

        cache.put(key, entry);
    }
}

class CacheEntry{
    private List<Candle> data;
    private long expiryTime;

    public List<Candle> getData() { return data; }
    public void setData(List<Candle> data) { this.data = data; }

    public long getExpiryTime() { return expiryTime; }
    public void setExpiryTime(long expiryTime) { this.expiryTime = expiryTime; }

    public boolean isExpired() {
        return System.currentTimeMillis() > expiryTime;
    }
}