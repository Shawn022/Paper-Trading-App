import { useEffect, useState } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";

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

    return (
        <div className="space-y-6 p-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Portfolio
                </h1>
                <p className="text-slate-500 mt-1">
                    Your holdings and performance overview
                </p>
            </div>

            {/* STATS (same style as dashboard) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                <StatCard
                    title="Portfolio Value"
                    value={`₹ ${Number(portfolio.portfolioValue).toLocaleString("en-IN")}`}
                />

                <StatCard
                    title="Cash Balance"
                    value={`₹ ${Number(portfolio.balance).toLocaleString("en-IN")}`}
                />

                <StatCard
                    title="Holdings Value"
                    value={`₹ ${Number(portfolio.holdingsValue).toLocaleString("en-IN")}`}
                />

                <StatCard
                    title="Realised P/L"
                    value={`₹ ${Number(portfolio.realisedPnL).toLocaleString("en-IN")}`}
                    positive={Number(portfolio.realisedPnL) >= 0}
                />

                <StatCard
                    title="Unrealised P/L"
                    value={`₹ ${Number(portfolio.unrealisedPnL).toLocaleString("en-IN")}`}
                    positive={Number(portfolio.unrealisedPnL) >= 0}
                />

                <StatCard
                    title="Unrealised P/L %"
                    value={`${Number(portfolio.unrealisedPnLPercent).toFixed(2)}%`}
                    positive={Number(portfolio.unrealisedPnLPercent) >= 0}
                />

                <StatCard
                    title="Total P/L"
                    value={`₹ ${Number(portfolio.totalPnL).toLocaleString("en-IN")}`}
                    positive={Number(portfolio.totalPnL) >= 0}
                />

                <StatCard
                    title="Total Return %"
                    value={`${Number(portfolio.totalPnLPercent).toFixed(2)}%`}
                    positive={Number(portfolio.totalPnLPercent) >= 0}
                />

            </div>

            {/* HOLDINGS TABLE */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-xl font-semibold">
                        Holdings
                    </h2>
                </div>

                <div className="overflow-x-auto">

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
                            {portfolio.holdings?.map((holding) => (
                                <tr
                                    key={holding.symbol}
                                    className="border-t border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {holding.symbol}
                                    </td>

                                    <td className="px-6 py-4">
                                        {holding.quantity}
                                    </td>

                                    <td className="px-6 py-4">
                                        ₹ {holding.avgBuyPrice}
                                    </td>

                                    <td className="px-6 py-4">
                                        ₹ {holding.currentPrice}
                                    </td>

                                    <td className="px-6 py-4">
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

                                    {/* 🔥 NEW SELL BUTTON */}
                                    <td className="px-6 py-4">
                                        <Link
                                            key={holding.symbol}
                                            to={`/stocks/${holding.symbol}`}
                                        >
                                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                                                SELL
                                            </button>
                                        </Link>

                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            </div>

        </div>
    );
}

export default PortfolioPage;