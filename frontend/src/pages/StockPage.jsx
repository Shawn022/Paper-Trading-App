import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";
import StockChartContainer from "../components/chart/StockChartContainer";
import TradeBox from "../components/TradeBox";

import { usePortfolioStore } from "../store/portfolioStore";
import { subscribeToStock } from "../services/websocket";

function StockPage() {
    const { symbol } = useParams();

    const { portfolio, fetchPortfolio, loading } = usePortfolioStore();

    const [stock, setStock] = useState(null);
    const [graph, setGraph] = useState("intraday");

    const [intradayCandles, setIntradayCandles] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        async function load() {
            try {
                const stockRes = await api.get(
                    `/api/stock/${symbol}/history`
                );

                setStock(stockRes.data);
                setIntradayCandles(
                    stockRes.data.intradayCandles
                );
            } catch (err) {
                console.error(err);
            }
        }

        load();
    }, [symbol]);

    useEffect(() => {

        const subscription = subscribeToStock(
            symbol,
            (update) => {

                if (!update?.candle) return;

                // Smooth chart update
                chartRef.current?.updateCandle(
                    update.candle
                );

                // Persist candle in state
                setIntradayCandles(prev => {

                    const copy = [...prev];

                    if (copy.length === 0) {
                        return [update.candle];
                    }

                    const last =
                        copy[copy.length - 1];

                    if (
                        last.timestamp ===
                        update.candle.timestamp
                    ) {
                        copy[copy.length - 1] =
                            update.candle;
                    } else {
                        copy.push(
                            update.candle
                        );
                    }

                    return copy;
                });
            }
        );

        return () => {
            subscription?.unsubscribe();
        };

    }, [symbol]);


    if (loading || !portfolio || !stock)
        return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

            {/* CHART */}
            <div className="md:col-span-2">
                <div className="bg-white border rounded-xl p-4">

                    <div className="flex items-center justify-between mb-4">

                        <h1 className="text-xl font-bold">
                            {symbol}
                        </h1>

                        <div className="flex bg-gray-100 rounded-lg p-1">

                            <button
                                onClick={() => setGraph("intraday")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition
                    ${graph === "intraday"
                                        ? "bg-blue-600 text-white shadow"
                                        : "text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Intraday
                            </button>

                            <button
                                onClick={() => setGraph("history")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition
                    ${graph === "history"
                                        ? "bg-blue-600 text-white shadow"
                                        : "text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Last 90 days
                            </button>

                        </div>
                    </div>

                    <StockChartContainer
                        key={`${symbol}-${graph}`}
                        ref={graph === "intraday"
                            ? chartRef
                            : null}
                        candles={
                            graph === "intraday"
                                ? intradayCandles
                                : stock.historyCandles
                        }
                    />

                </div>
            </div>

            {/* TRADE BOX */}
            <div>
                <TradeBox symbol={symbol} price={stock.price} />
            </div>

        </div>
    );
}

export default StockPage;