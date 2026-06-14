package com.papertrading.backend.service.stock;

import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Component
public class MarketHoursService {

    private static final ZoneId IST =
            ZoneId.of("Asia/Kolkata");

    private static final LocalTime MARKET_OPEN =
            LocalTime.of(9, 15);

    private static final LocalTime MARKET_CLOSE =
            LocalTime.of(15, 30);

    public boolean isMarketOpen() {

        ZonedDateTime now = ZonedDateTime.now(IST);

        DayOfWeek day = now.getDayOfWeek();

        if (day == DayOfWeek.SATURDAY ||
                day == DayOfWeek.SUNDAY) {
            return false;
        }

        LocalTime currentTime = now.toLocalTime();

        return !currentTime.isBefore(MARKET_OPEN)
                && currentTime.isBefore(MARKET_CLOSE);
    }
}
