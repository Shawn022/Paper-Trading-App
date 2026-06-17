import { useState } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";
import {
    Wallet,
    Landmark,
    Layers,
    BadgeCheck,
    TrendingUp,
    Percent,
    PieChart,
    Gauge
} from "lucide-react";

function PortfolioPage() {
    const { portfolio, fetchPortfolio, loading } = usePortfolioStore();

    const [error, setError] = useState("");

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-slate-500">
                    Loading portfolio...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
            </div>
        );
    }

    if (!portfolio) return null;

    const holdings = portfolio.holdings ?? [];

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Portfolio
                </h1>
                <p className="text-slate-500 mt-1 text-sm sm:text-base">
                    Your holdings and performance overview
                </p>
            </div>

            {/* STATS (same style as dashboard) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">

                <StatCard
                    title="Portfolio Value"
                    value={`₹ ${Number(portfolio.portfolioValue).toLocaleString("en-IN")}`}
                    icon={Wallet}
                />

                <StatCard
                    title="Cash Balance"
                    value={`₹ ${Number(portfolio.balance).toLocaleString("en-IN")}`}
                    icon={Landmark}
                />

                <StatCard
                    title="Holdings Value"
                    value={`₹ ${Number(portfolio.holdingsValue).toLocaleString("en-IN")}`}
                    icon={Layers}
                />

                <StatCard
                    title="Realised P/L"
                    value={`₹ ${Number(portfolio.realisedPnL).toLocaleString("en-IN")}`}
                    icon={BadgeCheck}
                    positive={Number(portfolio.realisedPnL) >= 0}
                />

                <StatCard
                    title="Unrealised P/L"
                    value={`₹ ${Number(portfolio.unrealisedPnL).toLocaleString("en-IN")}`}
                    icon={TrendingUp}
                    positive={Number(portfolio.unrealisedPnL) >= 0}
                />

                <StatCard
                    title="Unrealised P/L %"
                    value={`${Number(portfolio.unrealisedPnLPercent).toFixed(2)}%`}
                    icon={Percent}
                    positive={Number(portfolio.unrealisedPnLPercent) >= 0}
                />

                <StatCard
                    title="Total P/L"
                    value={`₹ ${Number(portfolio.totalPnL).toLocaleString("en-IN")}`}
                    icon={PieChart}
                    positive={Number(portfolio.totalPnL) >= 0}
                />

                <StatCard
                    title="Total Return %"
                    value={`${Number(portfolio.totalPnLPercent).toFixed(2)}%`}
                    icon={Gauge}
                    positive={Number(portfolio.totalPnLPercent) >= 0}
                />

            </div>

            {/* HOLDINGS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                        Holdings
                    </h2>
                    {holdings.length > 0 && (
                        <span className="text-sm text-slate-500">
                            {holdings.length} {holdings.length === 1 ? "position" : "positions"}
                        </span>
                    )}
                </div>

                {holdings.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <p className="text-slate-500">
                            You don't have any holdings yet.
                        </p>
                        <Link
                            to="/markets"
                            className="inline-block mt-2 text-sm font-medium text-slate-900 hover:underline"
                        >
                            Browse markets to get started
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* TABLE — md and up */}
                        <div className="overflow-x-auto hidden md:block">

                            <table className="w-full text-sm">

                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                                            Symbol
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                                            Avg Buy
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                                            Current Price
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                                            Position Value
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                                            P/L
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {holdings.map((holding) => (
                                        <tr
                                            key={holding.symbol}
                                            className="border-t border-slate-100 hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {holding.symbol}
                                            </td>

                                            <td className="px-6 py-4 text-slate-700">
                                                {holding.quantity}
                                            </td>

                                            <td className="px-6 py-4 text-slate-700">
                                                ₹ {holding.avgBuyPrice}
                                            </td>

                                            <td className="px-6 py-4 text-slate-700">
                                                ₹ {holding.currentPrice}
                                            </td>

                                            <td className="px-6 py-4 text-slate-700">
                                                ₹ {holding.positionValue}
                                            </td>

                                            <td
                                                className={`px-6 py-4 font-semibold ${Number(holding.unrealisedPnL) >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                    }`}
                                            >
                                                ₹ {holding.unrealisedPnL}
                                            </td>

                                            <td className="px-6 py-4">
                                                <Link to={`/stocks/${holding.symbol}`}>
                                                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                                                        SELL
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>

                        {/* STACKED CARDS — below md */}
                        <div className="md:hidden divide-y divide-slate-100">

                            {holdings.map((holding) => (
                                <div key={holding.symbol} className="p-4">

                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-semibold text-slate-900">
                                            {holding.symbol}
                                        </p>

                                        <Link to={`/stocks/${holding.symbol}`}>
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                                                SELL
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-sm">
                                        <span className="text-slate-500">Quantity</span>
                                        <span className="text-right text-slate-900">{holding.quantity}</span>

                                        <span className="text-slate-500">Avg Buy</span>
                                        <span className="text-right text-slate-900">₹ {holding.avgBuyPrice}</span>

                                        <span className="text-slate-500">Current Price</span>
                                        <span className="text-right text-slate-900">₹ {holding.currentPrice}</span>

                                        <span className="text-slate-500">Position Value</span>
                                        <span className="text-right text-slate-900">₹ {holding.positionValue}</span>

                                        <span className="text-slate-500">P/L</span>
                                        <span
                                            className={`text-right font-semibold ${Number(holding.unrealisedPnL) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            ₹ {holding.unrealisedPnL}
                                        </span>
                                    </div>

                                </div>
                            ))}

                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

export default PortfolioPage;