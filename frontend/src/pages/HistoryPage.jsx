import { useEffect, useMemo, useState } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    History,
    ListFilter,
    Search,
    X
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import { getTradeHistory } from "../services/historyService";
import { formatCurrency, formatNumber } from "../utils/formatters";

const FILTERS = ["ALL", "BUY", "SELL"];

function TypeBadge({ type }) {
    const isBuy = type === "BUY";
    const Icon = isBuy ? ArrowDownLeft : ArrowUpRight;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ${isBuy ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            <Icon className="h-3.5 w-3.5" />
            {type}
        </span>
    );
}

function HistoryPage() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        async function load() {
            try {
                const data = await getTradeHistory();
                setTrades(data);
            } catch {
                setError("Failed to load trades.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    const filteredTrades = useMemo(() => (
        trades
            .filter((trade) => filter === "ALL" || trade.type === filter)
            .filter((trade) => trade.stockSymbol?.toLowerCase().includes(search.trim().toLowerCase()))
    ), [filter, search, trades]);

    const totalPages = Math.max(1, Math.ceil(filteredTrades.length / pageSize));

    const currentPage = Math.min(page, totalPages);

    const paginatedTrades = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTrades.slice(start, start + pageSize);
    }, [currentPage, filteredTrades]);

    function clearFilters() {
        setSearch("");
        setFilter("ALL");
        setPage(1);
    }

    return (
        <div className="space-y-8">
            <PageHeader
                eyebrow="Execution ledger"
                title="Trade History"
                description="Review every buy and sell order executed by your paper account."
                icon={History}
                meta={
                    <>
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
                            {formatNumber(trades.length)} total trades
                        </span>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700 ring-1 ring-teal-100">
                            {formatNumber(filteredTrades.length)} visible
                        </span>
                    </>
                }
            />

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-sm">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search symbol"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
                            aria-label="Search by symbol"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setPage(1);
                                }}
                                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1">
                        <ListFilter className="ml-2 hidden h-4 w-4 text-slate-400 sm:block" />
                        {FILTERS.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => {
                                    setFilter(item);
                                    setPage(1);
                                }}
                                className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                                    filter === item
                                        ? "bg-white text-slate-950 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-white/80" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-700">
                    {error}
                </div>
            ) : trades.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <p className="text-lg font-black text-slate-950">No trades yet</p>
                    <p className="mt-1 text-sm text-slate-500">No executed orders found.</p>
                </div>
            ) : filteredTrades.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <p className="text-lg font-black text-slate-950">No trades match your filters</p>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left">
                                    <tr>
                                        {["ID", "Symbol", "Type", "Quantity", "Price", "Timestamp"].map(header => (
                                            <th key={header} className="px-5 py-3 font-bold text-slate-500">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {paginatedTrades.map((trade) => (
                                        <tr key={trade.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-4 font-mono text-xs text-slate-400">
                                                #{trade.id}
                                            </td>
                                            <td className="px-5 py-4 font-black text-slate-950">
                                                {trade.stockSymbol}
                                            </td>
                                            <td className="px-5 py-4">
                                                <TypeBadge type={trade.type} />
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-700">
                                                {formatNumber(trade.quantity, { maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-700">
                                                {formatCurrency(trade.price)}
                                            </td>
                                            <td className="px-5 py-4 font-medium text-slate-500">
                                                {new Date(trade.timestamp).toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:hidden">
                        {paginatedTrades.map((trade) => (
                            <div key={trade.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-black text-slate-950">{trade.stockSymbol}</p>
                                        <p className="mt-1 text-xs font-medium text-slate-400">
                                            {new Date(trade.timestamp).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <TypeBadge type={trade.type} />
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                                        <p className="text-xs font-semibold text-slate-400">Quantity</p>
                                        <p className="font-black text-slate-800">
                                            {formatNumber(trade.quantity, { maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                                        <p className="text-xs font-semibold text-slate-400">Price</p>
                                        <p className="font-black text-slate-800">{formatCurrency(trade.price)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setPage(Math.max(1, currentPage - 1))}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                        </button>

                        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm ring-1 ring-slate-200">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700 disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default HistoryPage;
