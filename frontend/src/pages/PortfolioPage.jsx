import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BadgeCheck,
    BriefcaseBusiness,
    Gauge,
    Landmark,
    Layers,
    PieChart as PieChartIcon,
    Percent,
    TrendingUp,
    Wallet
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { usePortfolioStore } from "../store/portfolioStore";
import { formatCurrency, formatNumber, formatPercent, toNumber } from "../utils/formatters";

const COLORS = ["#0f766e", "#f59e0b", "#0284c7", "#e11d48", "#7c3aed", "#16a34a"];

function PortfolioPage() {
    const { portfolio, fetchPortfolio, loading } = usePortfolioStore();

    useEffect(() => {
        if (!portfolio) {
            fetchPortfolio();
        }
    }, [fetchPortfolio, portfolio]);

    const holdings = useMemo(() => portfolio?.holdings ?? [], [portfolio]);

    const allocation = useMemo(() => (
        holdings
            .map((holding) => ({
                name: holding.symbol,
                value: toNumber(holding.positionValue)
            }))
            .filter(item => item.value > 0)
    ), [holdings]);

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

    return (
        <div className="space-y-8">
            <PageHeader
                eyebrow="Portfolio book"
                title="Portfolio"
                description="Track cash, invested capital, realised performance, and every open position."
                icon={BriefcaseBusiness}
                action={
                    <Link
                        to="/markets"
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
                    >
                        Add position
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                }
            />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Portfolio Value"
                    value={formatCurrency(portfolio.portfolioValue, { maximumFractionDigits: 0 })}
                    icon={Wallet}
                    accent="teal"
                />
                <StatCard
                    title="Cash Balance"
                    value={formatCurrency(portfolio.balance, { maximumFractionDigits: 0 })}
                    icon={Landmark}
                    accent="blue"
                />
                <StatCard
                    title="Holdings Value"
                    value={formatCurrency(portfolio.holdingsValue, { maximumFractionDigits: 0 })}
                    icon={Layers}
                    accent="amber"
                />
                <StatCard
                    title="Realised P/L"
                    value={formatCurrency(portfolio.realisedPnL, { maximumFractionDigits: 0 })}
                    icon={BadgeCheck}
                    positive={toNumber(portfolio.realisedPnL) >= 0}
                />
                <StatCard
                    title="Unrealised P/L"
                    value={formatCurrency(portfolio.unrealisedPnL, { maximumFractionDigits: 0 })}
                    icon={TrendingUp}
                    positive={toNumber(portfolio.unrealisedPnL) >= 0}
                />
                <StatCard
                    title="Unrealised Return"
                    value={formatPercent(portfolio.unrealisedPnLPercent)}
                    icon={Percent}
                    positive={toNumber(portfolio.unrealisedPnLPercent) >= 0}
                />
                <StatCard
                    title="Total P/L"
                    value={formatCurrency(portfolio.totalPnL, { maximumFractionDigits: 0 })}
                    icon={PieChartIcon}
                    positive={toNumber(portfolio.totalPnL) >= 0}
                />
                <StatCard
                    title="Total Return"
                    value={formatPercent(portfolio.totalPnLPercent)}
                    icon={Gauge}
                    positive={toNumber(portfolio.totalPnLPercent) >= 0}
                />
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.6fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                Allocation
                            </p>
                            <h2 className="mt-1 text-xl font-black text-slate-950">
                                Holdings Mix
                            </h2>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                            <PieChartIcon className="h-5 w-5" />
                        </div>
                    </div>

                    {allocation.length === 0 ? (
                        <div className="mt-8 rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                            No allocation data yet.
                        </div>
                    ) : (
                        <>
                            <div className="mt-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={allocation}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={62}
                                            outerRadius={92}
                                            paddingAngle={3}
                                        >
                                            {allocation.map((entry, index) => (
                                                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-2">
                                {allocation.slice(0, 5).map((item, index) => (
                                    <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="text-sm font-bold text-slate-700">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-500">
                                            {formatCurrency(item.value, { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                                Open positions
                            </p>
                            <h2 className="mt-1 text-xl font-black text-slate-950">
                                Holdings
                            </h2>
                        </div>

                        {holdings.length > 0 && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                {holdings.length} {holdings.length === 1 ? "position" : "positions"}
                            </span>
                        )}
                    </div>

                    {holdings.length === 0 ? (
                        <div className="px-5 py-14 text-center">
                            <p className="text-lg font-black text-slate-950">No holdings yet</p>
                            <p className="mt-1 text-sm text-slate-500">Browse markets to build your first paper position.</p>
                            <Link
                                to="/markets"
                                className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                            >
                                Browse markets
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-left">
                                        <tr>
                                            {["Symbol", "Qty", "Avg Buy", "Current", "Value", "P/L", "Action"].map(header => (
                                                <th key={header} className="px-5 py-3 font-bold text-slate-500">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {holdings.map((holding) => {
                                            const pnl = toNumber(holding.unrealisedPnL);

                                            return (
                                                <tr key={holding.symbol} className="transition hover:bg-slate-50">
                                                    <td className="px-5 py-4">
                                                        <Link to={`/stocks/${holding.symbol}`} className="font-black text-slate-950 hover:text-teal-700">
                                                            {holding.symbol}
                                                        </Link>
                                                    </td>
                                                    <td className="px-5 py-4 font-semibold text-slate-700">
                                                        {formatNumber(holding.quantity, { maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-5 py-4 font-semibold text-slate-600">
                                                        {formatCurrency(holding.avgBuyPrice)}
                                                    </td>
                                                    <td className="px-5 py-4 font-semibold text-slate-600">
                                                        {formatCurrency(holding.currentPrice)}
                                                    </td>
                                                    <td className="px-5 py-4 font-semibold text-slate-600">
                                                        {formatCurrency(holding.positionValue)}
                                                    </td>
                                                    <td className={`px-5 py-4 font-black ${pnl >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                                                        {pnl >= 0 ? "+" : ""}{formatCurrency(pnl)}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <Link
                                                            to={`/stocks/${holding.symbol}`}
                                                            className="inline-flex rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700 transition hover:bg-rose-100"
                                                        >
                                                            Sell
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="divide-y divide-slate-100 md:hidden">
                                {holdings.map((holding) => {
                                    const pnl = toNumber(holding.unrealisedPnL);

                                    return (
                                        <div key={holding.symbol} className="p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <Link to={`/stocks/${holding.symbol}`} className="text-lg font-black text-slate-950">
                                                        {holding.symbol}
                                                    </Link>
                                                    <p className="text-sm font-medium text-slate-500">
                                                        {formatNumber(holding.quantity, { maximumFractionDigits: 2 })} shares
                                                    </p>
                                                </div>

                                                <Link
                                                    to={`/stocks/${holding.symbol}`}
                                                    className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700"
                                                >
                                                    Sell
                                                </Link>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                    <p className="text-xs font-semibold text-slate-400">Avg Buy</p>
                                                    <p className="font-bold text-slate-800">{formatCurrency(holding.avgBuyPrice)}</p>
                                                </div>
                                                <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                    <p className="text-xs font-semibold text-slate-400">Current</p>
                                                    <p className="font-bold text-slate-800">{formatCurrency(holding.currentPrice)}</p>
                                                </div>
                                                <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                    <p className="text-xs font-semibold text-slate-400">Value</p>
                                                    <p className="font-bold text-slate-800">{formatCurrency(holding.positionValue)}</p>
                                                </div>
                                                <div className={`rounded-xl px-3 py-2 ${pnl >= 0 ? "bg-emerald-50" : "bg-rose-50"}`}>
                                                    <p className={`text-xs font-semibold ${pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>P/L</p>
                                                    <p className={`font-black ${pnl >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                                                        {pnl >= 0 ? "+" : ""}{formatCurrency(pnl)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default PortfolioPage;
