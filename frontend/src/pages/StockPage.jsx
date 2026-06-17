import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Clock3,
    Layers,
    LineChart,
    TrendingUp
} from "lucide-react";

import StockChartContainer from "../components/chart/StockChartContainer";
import TradeBox from "../components/TradeBox";
import { getStock } from "../services/stockService";
import { subscribeToStock } from "../services/websocket";
import { usePortfolioStore } from "../store/portfolioStore";
import { formatCurrency, formatNumber, formatPercent, toNumber } from "../utils/formatters";

function StockStat({ label, value, icon: Icon, tone = "slate" }) {
    const tones = {
        teal: "bg-teal-50 text-teal-700",
        amber: "bg-amber-50 text-amber-700",
        rose: "bg-rose-50 text-rose-700",
        slate: "bg-slate-100 text-slate-700"
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {label}
                </p>
                {Icon && (
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tones[tone]}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                )}
            </div>
            <p className="mt-3 text-xl font-black text-slate-950">
                {value}
            </p>
        </div>
    );
}

function StockPage() {
    const { symbol } = useParams();
    const { portfolio, fetchPortfolio } = usePortfolioStore();

    const [stock, setStock] = useState(null);
    const [graph, setGraph] = useState("intraday");
    const [intradayCandles, setIntradayCandles] = useState([]);
    const [error, setError] = useState("");
    const chartRef = useRef(null);

    useEffect(() => {
        if (!portfolio) {
            fetchPortfolio();
        }
    }, [fetchPortfolio, portfolio]);

    useEffect(() => {
        async function load() {
            try {
                setError("");
                const stockData = await getStock(symbol);
                setStock(stockData);
                setIntradayCandles(stockData.intradayCandles ?? []);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load stock data.");
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

    const holding = useMemo(
        () => portfolio?.holdings?.find(item => item.symbol === symbol),
        [portfolio, symbol]
    );

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-center shadow-sm">
                    <p className="text-lg font-black text-rose-700">{symbol}</p>
                    <p className="mt-1 text-sm font-semibold text-rose-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!stock || !portfolio) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
                    <span className="text-sm font-semibold text-slate-500">Loading {symbol}...</span>
                </div>
            </div>
        );
    }

    const priceChange = toNumber(stock.change);
    const priceChangePercent = toNumber(stock.changePercent);
    const isPositive = priceChange >= 0;
    const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;
    const candles = graph === "intraday" ? intradayCandles : stock.historyCandles ?? [];
    const lastUpdated = stock.lastUpdated
        ? new Date(stock.lastUpdated).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        })
        : "Live";

    return (
        <div className="space-y-8">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="market-grid border-b border-slate-100 bg-slate-50 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-lg font-black text-white shadow-lg shadow-slate-900/15">
                                {symbol?.slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                        {symbol}
                                    </h1>
                                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 ring-1 ring-teal-100">
                                        Live feed
                                    </span>
                                </div>
                                <p className="mt-1 truncate text-sm font-medium text-slate-500 sm:text-base">
                                    {stock.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                            <p className="text-4xl font-black tracking-tight text-slate-950">
                                {formatCurrency(stock.price)}
                            </p>
                            <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-black ${isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                                <ChangeIcon className="h-4 w-4" />
                                {isPositive ? "+" : ""}{formatCurrency(priceChange)} ({isPositive ? "+" : ""}{formatPercent(priceChangePercent)})
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StockStat
                        label="Day High"
                        value={formatCurrency(stock.dayHigh)}
                        icon={TrendingUp}
                        tone="teal"
                    />
                    <StockStat
                        label="Day Low"
                        value={formatCurrency(stock.dayLow)}
                        icon={ArrowDownRight}
                        tone="rose"
                    />
                    <StockStat
                        label="Previous Close"
                        value={formatCurrency(stock.previousClose)}
                        icon={Clock3}
                        tone="amber"
                    />
                    <StockStat
                        label="Volume"
                        value={formatNumber(stock.volume, { maximumFractionDigits: 0 })}
                        icon={Layers}
                    />
                </div>
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_0.85fr]">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                Price chart
                            </p>
                            <h2 className="mt-1 text-xl font-black text-slate-950">
                                {graph === "intraday" ? "Today's candles" : "Historical candles"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
                            {[
                                ["intraday", "Today"],
                                ["history", "90 days"]
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setGraph(value)}
                                    className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                                        graph === value
                                            ? "bg-white text-slate-950 shadow-sm"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-3 sm:p-4">
                        <StockChartContainer
                            key={`${symbol}-${graph}`}
                            ref={graph === "intraday" ? chartRef : null}
                            candles={candles}
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs font-semibold text-slate-400">
                        <span className="inline-flex items-center gap-2">
                            <Activity className="h-4 w-4 text-teal-600" />
                            {formatNumber(candles.length, { maximumFractionDigits: 0 })} candles loaded
                        </span>
                        <span>Updated {lastUpdated}</span>
                    </div>
                </div>

                <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Position
                                </p>
                                <h3 className="text-lg font-black text-slate-950">
                                    {holding ? "Holding active" : "No holding"}
                                </h3>
                            </div>
                        </div>

                        {holding ? (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                                    <p className="text-xs font-semibold text-slate-400">Quantity</p>
                                    <p className="mt-1 font-black text-slate-950">
                                        {formatNumber(holding.quantity, { maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                                    <p className="text-xs font-semibold text-slate-400">Avg buy</p>
                                    <p className="mt-1 font-black text-slate-950">
                                        {formatCurrency(holding.avgBuyPrice)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm leading-6 text-slate-500">
                                No current position for {symbol}.
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="mb-3 flex items-center gap-2 px-1">
                            <LineChart className="h-4 w-4 text-teal-700" />
                            <p className="text-sm font-black text-slate-950">Order ticket</p>
                        </div>
                        <TradeBox symbol={symbol} price={stock.price} />
                    </div>
                </aside>
            </section>
        </div>
    );
}

export default StockPage;
