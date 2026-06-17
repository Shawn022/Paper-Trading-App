import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

import { createChartEngine } from "./ChartEngine";
import { formatCandles, formatCandle } from "./utils";

const INITIAL_VISIBLE_CANDLES = 80;

function getChartHeight() {
    if (typeof window === "undefined") return 420;
    if (window.innerWidth < 480) return 260;
    if (window.innerWidth < 768) return 320;
    return 420;
}

const StockChartContainer = forwardRef(({ candles }, ref) => {
    const containerRef = useRef(null);
    const engineRef = useRef(null);
    const resizeObserverRef = useRef(null);
    // Track whether we've already set the initial zoom so resize never resets it
    const zoomedRef = useRef(false);

    function applyInitialZoom(engine, data) {
        if (!data?.length) return;
        const timeScale = engine.chart.timeScale();
        const to = data.length - 1;
        const from = Math.max(0, to - (INITIAL_VISIBLE_CANDLES - 1));
        timeScale.setVisibleLogicalRange({ from, to: to + 1.5 });
    }

    useEffect(() => {
        if (!containerRef.current) return;

        const engine = createChartEngine(containerRef.current);
        engineRef.current = engine;
        zoomedRef.current = false;

        if (candles?.length) {
            const formatted = formatCandles(candles);
            engine.candleSeries.setData(formatted);
            applyInitialZoom(engine, formatted);
            zoomedRef.current = true;
        }

        // ResizeObserver only fixes canvas dimensions — never touches the zoom
        resizeObserverRef.current = new ResizeObserver((entries) => {
            const { width } = entries[0].contentRect;
            if (!width || !engineRef.current) return;
            engineRef.current.chart.applyOptions({ width, height: getChartHeight() });
        });

        resizeObserverRef.current.observe(containerRef.current);

        return () => {
            resizeObserverRef.current?.disconnect();
            engine.destroy();
            engineRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!engineRef.current || !candles?.length) return;
        const formatted = formatCandles(candles);
        engineRef.current.candleSeries.setData(formatted);
        // Only zoom on the first data load, not on subsequent candle updates
        if (!zoomedRef.current) {
            applyInitialZoom(engineRef.current, formatted);
            zoomedRef.current = true;
        }
    }, [candles]);

    useImperativeHandle(ref, () => ({
        updateCandle(candle) {
            if (!engineRef.current || !candle) return;
            engineRef.current.candleSeries.update(formatCandle(candle));
        },
    }));

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                // Height set via JS/ResizeObserver; initial value avoids zero-height flash
                height: `${getChartHeight()}px`,
                // Prevent chart from creating a horizontal scrollbar on the page
                overflow: "hidden",
            }}
        />
    );
});

StockChartContainer.displayName = "StockChartContainer";

export default StockChartContainer;