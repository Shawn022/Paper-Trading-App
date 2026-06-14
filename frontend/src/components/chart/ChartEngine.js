import { createChart } from "lightweight-charts";

export function createChartEngine(container) {

    const chart = createChart(container, {
        height: 450,
        layout: {
            background: { color: "#ffffff" },
            textColor: "#111",
        },
        grid: {
            vertLines: { color: "#eee" },
            horzLines: { color: "#eee" },
        },
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        },
        rightPriceScale: {
            borderColor: "#ccc",
        }
    });

    const candleSeries = chart.addCandlestickSeries();

    return {
        chart,
        candleSeries,
        destroy: () => chart.remove()
    };
}