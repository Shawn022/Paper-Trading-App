import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Building2, Search, Sparkles, X } from "lucide-react";

import PageHeader from "../components/PageHeader";
import { getSupportedStocks } from "../services/stockService";
import { formatNumber } from "../utils/formatters";

function MarketsPage() {
    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const supportedStocks = await getSupportedStocks();
                setStocks(supportedStocks);
            } catch {
                setError("Unable to load supported stocks right now.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return stocks;

        return stocks.filter(stock => {
            const symbolMatch = stock.symbol?.toLowerCase().includes(query);
            const nameMatch = stock.name?.toLowerCase().includes(query);
            return symbolMatch || nameMatch;
        });
    }, [search, stocks]);

    return (
        <div className="space-y-8">
            <PageHeader
                eyebrow="Supported universe"
                title="Markets"
                description="Search the instruments connected to the paper-trading engine."
                icon={BarChart3}
                meta={
                    <>
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
                            {formatNumber(stocks.length)} listed stocks
                        </span>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700 ring-1 ring-teal-100">
                            Backend synced
                        </span>
                    </>
                }
            />

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-xl">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
                            placeholder="Search by symbol or company"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search stocks"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {!loading && !error && (
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            Showing {formatNumber(filtered.length)} of {formatNumber(stocks.length)}
                        </div>
                    )}
                </div>
            </section>

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white/80" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-700">
                    {error}
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <p className="text-lg font-black text-slate-950">No matches found</p>
                    <p className="mt-1 text-sm text-slate-500">Try a different symbol or company name.</p>
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-5 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map(stock => (
                        <Link
                            key={stock.symbol}
                            to={`/stocks/${stock.symbol}`}
                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/10"
                        >
                            <div className="market-grid border-b border-slate-100 bg-slate-50 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-900/15">
                                        {stock.symbol?.slice(0, 2)}
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700" />
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="truncate text-base font-black text-slate-950">
                                    {stock.symbol}
                                </p>
                                <div className="mt-2 flex items-start gap-2">
                                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                                    <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                                        {stock.name}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MarketsPage;
