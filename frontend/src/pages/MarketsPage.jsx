import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";

import { getSupportedStocks } from "../services/stockService";

function MarketsPage() {

    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState("");

    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function load() {

            const s = await getSupportedStocks();

            setStocks(s);
            setFiltered(s);
            setLoading(false);
        }

        load();

    }, []);

    useEffect(() => {

        const query = search.toLowerCase();

        const filteredStocks =
            stocks.filter(stock => {

                const symbolMatch =
                    stock.symbol
                        ?.toLowerCase()
                        .includes(query);

                const nameMatch =
                    stock.name
                        ?.toLowerCase()
                        .includes(query);

                return symbolMatch || nameMatch;
            });

        setFiltered(filteredStocks);

    }, [search, stocks]);

    return (

        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Markets
                </h1>
                <p className="text-slate-500 mt-1 text-sm sm:text-base">
                    Browse supported stocks
                </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full sm:w-96">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                <input
                    className="w-full border border-slate-200 pl-10 pr-9 py-2 rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                    placeholder="Search stocks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search stocks"
                />

                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

            </div>

            {/* RESULT COUNT */}
            {!loading && stocks.length > 0 && (
                <p className="text-sm text-slate-500">
                    Showing {filtered.length} of {stocks.length} stocks
                </p>
            )}

            {/* STOCK GRID */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-slate-500">
                        Loading stocks...
                    </p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-slate-500">
                        No stocks match "{search}".
                    </p>
                    <button
                        onClick={() => setSearch("")}
                        className="mt-2 text-sm font-medium text-slate-900 hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                    {filtered.map(stock => (

                        <Link
                            key={stock.symbol}
                            to={`/stocks/${stock.symbol}`}
                            className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 bg-white transition-all duration-200 hover:shadow-md hover:border-slate-300"
                        >
                            <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm flex items-center justify-center">
                                {stock.symbol?.slice(0, 2)}
                            </div>

                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">
                                    {stock.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {stock.symbol}
                                </p>
                            </div>
                        </Link>

                    ))}

                </div>
            )}

        </div>

    );
}

export default MarketsPage;