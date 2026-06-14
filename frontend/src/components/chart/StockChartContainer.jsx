import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

import { createChartEngine } from "./ChartEngine";
import { formatCandles, formatCandle } from "./utils";

const StockChartContainer = forwardRef(
    ({ candles }, ref) => {

        const containerRef = useRef(null);
        const engineRef = useRef(null);

        useEffect(() => {

            if (!containerRef.current) return;

            const engine =
                createChartEngine(
                    containerRef.current
                );

            engineRef.current = engine;

            // IMPORTANT:
            // Load data immediately if already present
            if (candles?.length) {

                engine.candleSeries.setData(
                    formatCandles(candles)
                );

                engine.chart
                    .timeScale()
                    .fitContent();
            }

            return () => {
                engine.destroy();
                engineRef.current = null;
            };

        }, []);

        // Load data whenever stock changes
        useEffect(() => {

            if (
                !engineRef.current ||
                !candles?.length
            ) {
                return;
            }

            engineRef.current
                .candleSeries
                .setData(
                    formatCandles(candles)
                );

        }, [candles]);

        useImperativeHandle(ref, () => ({

            updateCandle(candle) {

                if (
                    !engineRef.current ||
                    !candle
                ) {
                    return;
                }

                engineRef.current
                    .candleSeries
                    .update(
                        formatCandle(candle)
                    );
            }

        }));

        return (
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "500px"
                }}
            />
        );
    }
);

export default StockChartContainer;