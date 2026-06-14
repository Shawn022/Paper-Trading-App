import { useEffect, useMemo, useState } from "react";
import { getTradeHistory } from "../services/historyService";

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
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
    }, [trades, filter, search]);

    // ---------------- PAGINATION ----------------
    const totalPages = Math.ceil(filteredTrades.length / pageSize);

    const paginatedTrades = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredTrades.slice(start, start + pageSize);
    }, [filteredTrades, page]);

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
        <div className="space-y-6 p-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Trade History
                </h1>
                <p className="text-slate-500 mt-1">
                    All executed BUY and SELL transactions
                </p>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center">

                {/* SEARCH */}
                <input
                    type="text"
                    placeholder="Search symbol..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="border px-3 py-2 rounded w-full md:w-64"
                />

                {/* FILTER BUTTONS */}
                <div className="flex gap-2">
                    {["ALL", "BUY", "SELL"].map((f) => (
                        <button
                            key={f}
                            onClick={() => {
                                setFilter(f);
                                setPage(1);
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium ${filter === f
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-xl overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left">ID</th>
                                <th className="px-6 py-3 text-left">Symbol</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">Quantity</th>
                                <th className="px-6 py-3 text-left">Price</th>
                                <th className="px-6 py-3 text-left">Timestamp</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedTrades.map((trade) => (
                                <tr
                                    key={trade.id}
                                    className="border-t hover:bg-slate-50"
                                >

                                    <td className="px-6 py-4 text-slate-500">
                                        {trade.id}
                                    </td>

                                    <td className="px-6 py-4 font-medium">
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

                                    <td className="px-6 py-4">
                                        {Number(trade.quantity)}
                                    </td>

                                    <td className="px-6 py-4">
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

            {/* PAGINATION */}
            <div className="flex items-center gap-3">

                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="text-sm text-slate-600">
                    Page {page} of {totalPages || 1}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>

            </div>
        </div>
    );
}

export default HistoryPage;