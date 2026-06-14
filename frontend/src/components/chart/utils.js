const IST_OFFSET =
    5.5 * 60 * 60;

export function formatCandle(
    candle
) {

    return {
        time:
            candle.timestamp +
            IST_OFFSET,

        open:
            Number(candle.open),

        high:
            Number(candle.high),

        low:
            Number(candle.low),

        close:
            Number(candle.close),
    };
}

export function formatCandles(
    candles
) {

    if (!candles) return [];

    return [...candles]
        .sort(
            (a, b) =>
                a.timestamp -
                b.timestamp
        )
        .map(
            formatCandle
        );
}