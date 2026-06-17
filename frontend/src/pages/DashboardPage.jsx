import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { usePortfolioStore } from "../store/portfolioStore";
import { getTopHistorical, getTopIntraday } from "../services/suggestionService";
import { Wallet, Landmark, Layers, TrendingUp, PieChart, Percent, Zap, LineChart } from "lucide-react";

function DashboardPage() {
    const { portfolio, fetchPortfolio, loading } = usePortfolioStore();

    const [error, setError] = useState("");

    const [topIntraday, setTopIntraday] = useState([]);
    const [topHistorical, setTopHistorical] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);

    useEffect(() => {

        async function load() {
            try {
                const [intraday, historical] =
                    await Promise.all([
                        getTopIntraday(),
                        getTopHistorical()
                    ]);

                setTopIntraday(intraday);
                setTopHistorical(historical);
            } catch (err) {
                setError("Unable to load stock suggestions right now.");
            } finally {
                setSuggestionsLoading(false);
            }
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
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Dashboard
                </h1>
                <p className="text-slate-500 mt-1 text-sm sm:text-base">
                    Overview of your portfolio
                </p>
            </div>

            {/* STAT CARDS */}
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
                    title="Unrealised P/L"
                    value={`₹ ${Number(portfolio.unrealisedPnL).toLocaleString("en-IN")}`}
                    icon={TrendingUp}
                    positive={Number(portfolio.unrealisedPnL) >= 0}
                />

                <StatCard
                    title="Total P/L"
                    value={`₹ ${Number(portfolio.totalPnL).toLocaleString("en-IN")}`}
                    icon={PieChart}
                    positive={Number(portfolio.totalPnL) >= 0}
                />

                <StatCard
                    title="Total Return %"
                    value={`${portfolio.totalPnLPercent}%`}
                    icon={Percent}
                    positive={Number(portfolio.totalPnLPercent) >= 0}
                />

            </div>

            {/* TOP INTRADAY */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">

                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-400" />
                    Top Intraday Stocks
                </h2>

                {suggestionsLoading ? (
                    <p className="text-sm text-slate-400">
                        Loading suggestions...
                    </p>
                ) : topIntraday.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        No intraday suggestions available right now.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                        {topIntraday.map(stock => (

                            <Link
                                key={stock.symbol}
                                to={`/stocks/${stock.symbol}`}
                            >
                                <div
                                    key={stock.symbol}
                                    className="border border-slate-200 rounded-lg p-3 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                                >
                                    <p className="font-medium text-slate-900 truncate">
                                        {stock.symbol} • {stock.name}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                                        <span className="text-slate-500">
                                            Trend: {stock.trendScore.toFixed(2)}
                                        </span>
                                        <span className="text-red-500">
                                            Risk: {stock.riskScore.toFixed(2)}
                                        </span>
                                    </div>

                                    <p className="font-bold text-green-600 mt-1">
                                        Score: {stock.weightedScore.toFixed(2)}
                                    </p>
                                </div>
                            </Link>

                        ))}

                    </div>
                )}

            </div>

            {/* TOP HISTORICAL */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">

                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-slate-400" />
                    Long Term Opportunities
                </h2>

                {suggestionsLoading ? (
                    <p className="text-sm text-slate-400">
                        Loading suggestions...
                    </p>
                ) : topHistorical.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        No long-term opportunities available right now.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                        {topHistorical.map(stock => (

                            <Link
                                key={stock.symbol}
                                to={`/stocks/${stock.symbol}`}
                            >
                                <div
                                    key={stock.symbol}
                                    className="border border-slate-200 rounded-lg p-3 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                                >
                                    <p className="font-medium text-slate-900 truncate">
                                        {stock.symbol} • {stock.name}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                                        <span className="text-slate-500">
                                            Trend: {stock.trendScore.toFixed(2)}
                                        </span>
                                        <span className="text-red-500">
                                            Risk: {stock.riskScore.toFixed(2)}
                                        </span>
                                    </div>

                                    <p className="font-bold text-green-600 mt-1">
                                        Score: {stock.weightedScore.toFixed(2)}
                                    </p>
                                </div>
                            </Link>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default DashboardPage;