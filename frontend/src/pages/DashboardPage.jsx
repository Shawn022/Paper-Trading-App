import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    ArrowRight,
    Gauge,
    Landmark,
    Layers,
    LineChart,
    PieChart,
    Percent,
    TrendingUp,
    Wallet,
    Zap
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { usePortfolioStore } from "../store/portfolioStore";
import { getTopHistorical, getTopIntraday } from "../services/suggestionService";
import { formatCurrency, formatNumber, formatPercent, toNumber } from "../utils/formatters";

function ScorePill({ label, value, tone = "slate" }) {
    const toneClass = {
        teal: "bg-teal-50 text-teal-700 border-teal-100",
        rose: "bg-rose-50 text-rose-700 border-rose-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        slate: "bg-slate-100 text-slate-600 border-slate-200"
    }[tone];

    return (
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${toneClass}`}>
            {label}: {toNumber(value).toFixed(2)}
        </span>
    );
}

function SuggestionCard({ stock, rank }) {
    return (
        <Link
            to={`/stocks/${stock.symbol}`}
            className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/10"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                            {rank}
                        </span>
                        <p className="truncate text-base font-black text-slate-950">
                            {stock.symbol}
                        </p>
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-500">
                        {stock.name}
                    </p>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <ScorePill label="Trend" value={stock.trendScore} tone="teal" />
                <ScorePill label="Risk" value={stock.riskScore} tone="rose" />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Weighted
                </span>
                <span className="text-lg font-black text-emerald-700">
                    {toNumber(stock.weightedScore).toFixed(2)}
                </span>
            </div>
        </Link>
    );
}

function SuggestionSection({ title, icon: Icon, stocks, loading, error, emptyText }) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
                        <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-black text-slate-950">
                        {title}
                    </h2>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {[1, 2, 3].map(item => (
                        <div key={item} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white/80" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                    {error}
                </div>
            ) : stocks.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                    {emptyText}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stocks.slice(0, 3).map((stock, index) => (
                        <SuggestionCard key={stock.symbol} stock={stock} rank={index + 1} />
                    ))}
                </div>
            )}
        </section>
    );
}

function DashboardPage() {
    const { portfolio, fetchPortfolio, loading } = usePortfolioStore();
    const [suggestionError, setSuggestionError] = useState("");
    const [topIntraday, setTopIntraday] = useState([]);
    const [topHistorical, setTopHistorical] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);

    useEffect(() => {
        if (!portfolio) {
            fetchPortfolio();
        }
    }, [fetchPortfolio, portfolio]);

    useEffect(() => {
        async function load() {
            try {
                const [intraday, historical] = await Promise.all([
                    getTopIntraday(),
                    getTopHistorical()
                ]);

                setTopIntraday(intraday);
                setTopHistorical(historical);
            } catch {
                setSuggestionError("Unable to load stock suggestions right now.");
            } finally {
                setSuggestionsLoading(false);
            }
        }

        load();
    }, []);

    const snapshot = useMemo(() => {
        const balance = toNumber(portfolio?.balance);
        const holdingsValue = toNumber(portfolio?.holdingsValue);
        const portfolioValue = toNumber(portfolio?.portfolioValue);
        const cashShare = portfolioValue > 0 ? (balance / portfolioValue) * 100 : 0;
        const holdingsShare = portfolioValue > 0 ? (holdingsValue / portfolioValue) * 100 : 0;

        return {
            balance,
            holdingsValue,
            portfolioValue,
            cashShare,
            holdingsShare,
            holdingsCount: portfolio?.holdings?.length ?? 0
        };
    }, [portfolio]);

    if (loading && !portfolio) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
                    <span className="text-sm font-semibold text-slate-500">Loading portfolio...</span>
                </div>
            </div>
        );
    }

    if (!portfolio) return null;

    const totalPnl = toNumber(portfolio.totalPnL);
    const unrealisedPnl = toNumber(portfolio.unrealisedPnL);

    return (
        <div className="space-y-8">
            <PageHeader
                eyebrow="Trading command center"
                title="Dashboard"
                description="Portfolio health, cash position, and stock signals in one clean workspace."
                icon={Activity}
                action={
                    <Link
                        to="/markets"
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold shadow-sm transition hover:bg-slate-800"
                    >
                        <p className="text-white ">
                            Explore markets<ArrowRight className="h-4 w-4" />
                        </p>
                    </Link>
                }
            />

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
                <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
                    <div className="market-grid p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-teal-100">
                                Live paper portfolio
                            </span>
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
                                {snapshot.holdingsCount} positions
                            </span>
                        </div>

                        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Portfolio value
                        </p>
                        <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                            {formatCurrency(snapshot.portfolioValue)}
                        </h2>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <span className={`rounded-2xl px-4 py-3 text-sm font-bold ${totalPnl >= 0 ? "bg-emerald-400/15 text-emerald-200" : "bg-rose-400/15 text-rose-200"}`}>
                                Total P/L {totalPnl >= 0 ? "+" : ""}{formatCurrency(totalPnl)}
                            </span>
                            <span className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-slate-200">
                                Return {formatPercent(portfolio.totalPnLPercent)}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:border-l lg:border-t-0">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                            <PieChart className="h-4 w-4 text-amber-300" />
                            Allocation
                        </div>

                        <div className="mt-6 space-y-5">
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-300">Cash</span>
                                    <span className="font-black text-white">{formatPercent(snapshot.cashShare, 1)}</span>
                                </div>
                                <div className="h-3 rounded-full bg-white/10">
                                    <div
                                        className="h-3 rounded-full bg-teal-400"
                                        style={{ width: `${Math.min(100, snapshot.cashShare)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-300">Holdings</span>
                                    <span className="font-black text-white">{formatPercent(snapshot.holdingsShare, 1)}</span>
                                </div>
                                <div className="h-3 rounded-full bg-white/10">
                                    <div
                                        className="h-3 rounded-full bg-amber-300"
                                        style={{ width: `${Math.min(100, snapshot.holdingsShare)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Unrealised P/L
                            </p>
                            <p className={`mt-1 text-2xl font-black ${unrealisedPnl >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                                {unrealisedPnl >= 0 ? "+" : ""}{formatCurrency(unrealisedPnl)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                    title="Cash Balance"
                    value={formatCurrency(portfolio.balance, { maximumFractionDigits: 0 })}
                    icon={Landmark}
                    accent="teal"
                    helper="Ready to deploy"
                />
                <StatCard
                    title="Holdings Value"
                    value={formatCurrency(portfolio.holdingsValue, { maximumFractionDigits: 0 })}
                    icon={Layers}
                    accent="amber"
                    helper={`${snapshot.holdingsCount} active holdings`}
                />
                <StatCard
                    title="Unrealised P/L"
                    value={formatCurrency(portfolio.unrealisedPnL, { maximumFractionDigits: 0 })}
                    icon={TrendingUp}
                    positive={unrealisedPnl >= 0}
                    helper="Open position movement"
                />
                <StatCard
                    title="Total P/L"
                    value={formatCurrency(portfolio.totalPnL, { maximumFractionDigits: 0 })}
                    icon={Wallet}
                    positive={totalPnl >= 0}
                    helper="Realised plus open"
                />
                <StatCard
                    title="Total Return"
                    value={formatPercent(portfolio.totalPnLPercent)}
                    icon={Percent}
                    positive={toNumber(portfolio.totalPnLPercent) >= 0}
                    helper="Portfolio-wide performance"
                />
                <StatCard
                    title="Signal Coverage"
                    value={formatNumber(topIntraday.length + topHistorical.length)}
                    icon={Gauge}
                    accent="blue"
                    helper="Suggestions loaded"
                />
            </section>

            <div className="space-y-8">
                <SuggestionSection
                    title="Top Intraday Stocks"
                    icon={Zap}
                    stocks={topIntraday}
                    loading={suggestionsLoading}
                    error={suggestionError}
                    emptyText="No intraday suggestions available right now."
                />

                <SuggestionSection
                    title="Long Term Opportunities"
                    icon={LineChart}
                    stocks={topHistorical}
                    loading={suggestionsLoading}
                    error={suggestionError}
                    emptyText="No long-term opportunities available right now."
                />
            </div>
        </div>
    );
}

export default DashboardPage;
