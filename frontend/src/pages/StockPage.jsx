import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";
import StockChartContainer from "../components/chart/StockChartContainer";
import TradeBox from "../components/TradeBox";

import { usePortfolioStore } from "../store/portfolioStore";
import { subscribeToStock } from "../services/websocket";

function StockPage() {
    const { symbol } = useParams();
    const { portfolio, fetchPortfolio } = usePortfolioStore();

    const [stock, setStock] = useState(null);
    const [graph, setGraph] = useState("intraday");
    const [intradayCandles, setIntradayCandles] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        async function load() {
            try {
                const stockRes = await api.get(`/api/stock/${symbol}/history`);
                setStock(stockRes.data);
                setIntradayCandles(stockRes.data.intradayCandles);
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, [symbol]);

    useEffect(() => {
        const subscription = subscribeToStock(symbol, (update) => {
            if (!update?.candle) return;

            chartRef.current?.updateCandle(update.candle);

            setIntradayCandles(prev => {
                const copy = [...prev];
                if (copy.length === 0) return [update.candle];
                const last = copy[copy.length - 1];
                if (last.timestamp === update.candle.timestamp) {
                    copy[copy.length - 1] = update.candle;
                } else {
                    copy.push(update.candle);
                }
                return copy;
            });
        });

        return () => subscription?.unsubscribe();
    }, [symbol]);

    if (!stock || !portfolio) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-slate-400 font-medium tracking-wide">Loading {symbol}…</span>
                </div>
            </div>
        );
    }

    const priceChange = stock.change ?? 0;
    const priceChangePercent = stock.changePercent ?? 0;
    const isPositive = priceChange >= 0;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold tracking-tight">{symbol?.slice(0, 2)}</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-none">{symbol}</h1>
                            {stock.companyName && (
                                <p className="text-sm text-slate-400 mt-0.5">{stock.companyName}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-slate-900 tabular-nums">
                            ₹{Number(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-sm font-semibold px-2 py-1 rounded-lg mb-1 ${isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {isPositive ? "▲" : "▼"} {Math.abs(priceChangePercent).toFixed(2)}%
                        </span>
                    </div>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Chart */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
                                <span className="text-sm font-semibold text-slate-600 uppercase tracking-widest">Price chart</span>
                                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                                    <button
                                        onClick={() => setGraph("intraday")}
                                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${graph === "intraday"
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-white"
                                            }`}
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => setGraph("history")}
                                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${graph === "history"
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-white"
                                            }`}
                                    >
                                        90 days
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <StockChartContainer
                                    key={`${symbol}-${graph}`}
                                    ref={graph === "intraday" ? chartRef : null}
                                    candles={graph === "intraday" ? intradayCandles : stock.historyCandles}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Trade box */}
                    <div className="lg:col-span-1">
                        <TradeBox symbol={symbol} price={stock.price} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockPage;