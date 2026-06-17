import { useEffect, useMemo, useState } from "react";
import { getTradeHistory } from "../services/historyService";
import { Search, X } from "lucide-react";

function HistoryPage() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // UI state
    const [filter, setFilter] = useState("ALL"); // ALL | BUY | SELL
    const [search, setSearch] = useState("");

    // pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        async function load() {
            try {
                const data = await getTradeHistory();
                setTrades(data);
            } catch (err) {
                setError("Failed to load trades");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // ---------------- FILTER + SEARCH ----------------
    const filteredTrades = useMemo(() => {
        return trades
            .filter((t) => {
                if (filter === "ALL") return true;
                return t.type === filter;
            })
            .filter((t) =>
                t.stockSymbol
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
    }, [trades, filter, search]);

    // ---------------- PAGINATION ----------------
    const totalPages = Math.ceil(filteredTrades.length / pageSize);

    const paginatedTrades = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredTrades.slice(start, start + pageSize);
    }, [filteredTrades, page]);

    function clearFilters() {
        setSearch("");
        setFilter("ALL");
        setPage(1);
    }

    // ---------------- UI STATES ----------------
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-slate-500">
                    Loading trade history...
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

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Trade History
                </h1>
                <p className="text-slate-500 mt-1 text-sm sm:text-base">
                    All executed BUY and SELL transactions
                </p>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

                {/* SEARCH */}
                <div className="relative w-full sm:w-64">

                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                    <input
                        type="text"
                        placeholder="Search symbol..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full border border-slate-200 pl-10 pr-9 py-2 rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                        aria-label="Search by symbol"
                    />

                    {search && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setPage(1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                </div>

                {/* FILTER BUTTONS */}
                <div className="flex gap-2">
                    {["ALL", "BUY", "SELL"].map((f) => (
                        <button
                            key={f}
                            onClick={() => {
                                setFilter(f);
                                setPage(1);
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${filter === f
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* RESULT COUNT */}
            {trades.length > 0 && (
                <p className="text-sm text-slate-500">
                    Showing {filteredTrades.length} of {trades.length} trades
                </p>
            )}

            {trades.length === 0 ? (

                <div className="bg-white border border-slate-200 rounded-xl text-center py-12 px-4">
                    <p className="text-slate-500">
                        You haven't made any trades yet.
                    </p>
                </div>

            ) : filteredTrades.length === 0 ? (

                <div className="bg-white border border-slate-200 rounded-xl text-center py-12 px-4">
                    <p className="text-slate-500">
                        No trades match your filters.
                    </p>
                    <button
                        onClick={clearFilters}
                        className="mt-2 text-sm font-medium text-slate-900 hover:underline"
                    >
                        Clear filters
                    </button>
                </div>

            ) : (
                <>

                    {/* TABLE — md and up */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hidden md:block">

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">ID</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">Symbol</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">Type</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">Quantity</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">Price</th>
                                        <th className="px-6 py-3 text-left font-semibold text-slate-600">Timestamp</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedTrades.map((trade) => (
                                        <tr
                                            key={trade.id}
                                            className="border-t border-slate-100 hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-4 text-slate-500">
                                                {trade.id}
                                            </td>

                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {trade.stockSymbol}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${trade.type === "BUY"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {trade.type}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-slate-700">
                                                {Number(trade.quantity)}
                                            </td>

                                            <td className="px-6 py-4 text-slate-700">
                                                ₹ {Number(trade.price).toLocaleString("en-IN")}
                                            </td>

                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(trade.timestamp).toLocaleString("en-IN")}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                    </div>

                    {/* STACKED CARDS — below md */}
                    <div className="md:hidden bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">

                        {paginatedTrades.map((trade) => (
                            <div key={trade.id} className="p-4">

                                <div className="flex items-center justify-between gap-3">

                                    <div className="min-w-0">
                                        <p className="font-medium text-slate-900">
                                            {trade.stockSymbol}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {new Date(trade.timestamp).toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold shrink-0 ${trade.type === "BUY"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {trade.type}
                                    </span>

                                </div>

                                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                                    <span>Qty: {Number(trade.quantity)}</span>
                                    <span>₹ {Number(trade.price).toLocaleString("en-IN")}</span>
                                </div>

                            </div>
                        ))}

                    </div>

                    {/* PAGINATION */}
                    <div className="flex items-center gap-3">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 border border-slate-200 rounded disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            Prev
                        </button>

                        <span className="text-sm text-slate-600">
                            Page {page} of {totalPages || 1}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 border border-slate-200 rounded disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            Next
                        </button>

                    </div>

                </>
            )}

        </div>
    );
}

export default HistoryPage;