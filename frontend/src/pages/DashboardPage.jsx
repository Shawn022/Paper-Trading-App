import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { usePortfolioStore } from "../store/portfolioStore";
import { getTopHistorical, getTopIntraday } from "../services/suggestionService";

function DashboardPage() {
    const { portfolio, fetchPortfolio, loading } = usePortfolioStore();

    const [error, setError] = useState(""); 4

    const [topIntraday, setTopIntraday] = useState([]);
    const [topHistorical, setTopHistorical] = useState([]);

    useEffect(() => {

        async function load() {

            const [ intraday, historical] =
                await Promise.all([
                    getTopIntraday(),
                    getTopHistorical()
                ]);

            setTopIntraday(intraday);
            setTopHistorical(historical);
        }

        load();

    }, []);


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
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Dashboard
                </h1>
                <p className="text-slate-500 mt-1">
                    Overview of your portfolio
                </p>
            </div>

            {/* STAT CARDS (UNCHANGED) */}
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
                    title="Unrealised P/L"
                    value={`₹ ${Number(portfolio.unrealisedPnL).toLocaleString("en-IN")}`}
                    positive={Number(portfolio.unrealisedPnL) >= 0}
                />

                <StatCard
                    title="Total P/L"
                    value={`₹ ${Number(portfolio.totalPnL).toLocaleString("en-IN")}`}
                    positive={Number(portfolio.totalPnL) >= 0}
                />

                <StatCard
                    title="Total Return %"
                    value={`${portfolio.totalPnLPercent}%`}
                    positive={Number(portfolio.totalPnLPercent) >= 0}
                />

            </div>

            {/* TOP INTRADAY */}
            <div className="bg-white border rounded-xl p-5">

                <h2 className="font-semibold mb-3">
                    ⚡ Top Intraday Stocks
                </h2>

                <div className="grid md:grid-cols-3 gap-3">

                    {topIntraday.map(stock => (

                        <div
                            key={stock.symbol}
                            className="border rounded-lg p-3"
                        >
                            <p className="font-medium">
                                {stock.symbol} • {stock.name}
                            </p>

                            <p className="text-sm text-slate-500">
                                Trend: {stock.trendScore.toFixed(2)}
                            </p>

                            <p className="text-sm text-red-500">
                                Risk: {stock.riskScore.toFixed(2)}
                            </p>

                            <p className="font-bold text-green-600">
                                Score: {stock.weightedScore.toFixed(2)}
                            </p>
                        </div>

                    ))}

                </div>

            </div>

            {/* TOP HISTORICAL */}
            <div className="bg-white border rounded-xl p-5">

                <h2 className="font-semibold mb-3">
                    📈 Long Term Opportunities
                </h2>

                <div className="grid md:grid-cols-3 gap-3">

                    {topHistorical.map(stock => (

                        <div
                            key={stock.symbol}
                            className="border rounded-lg p-3"
                        >
                            <p className="font-medium">
                                {stock.symbol}
                            </p>

                            <p className="text-sm text-slate-500">
                                Trend: {stock.trendScore.toFixed(2)}
                            </p>

                            <p className="text-sm text-red-500">
                                Risk: {stock.riskScore.toFixed(2)}
                            </p>

                            <p className="font-bold text-green-600">
                                Score: {stock.weightedScore.toFixed(2)}
                            </p>
                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default DashboardPage;