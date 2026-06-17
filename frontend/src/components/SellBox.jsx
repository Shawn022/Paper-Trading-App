import { useState } from "react";
import { Minus, PackageCheck, Plus, TrendingDown } from "lucide-react";

import { usePortfolioStore } from "../store/portfolioStore";
import { sellStock } from "../services/tradeService";
import { formatCurrency, formatNumber, toNumber } from "../utils/formatters";

function SellBox({ symbol, onResult }) {
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);

    const { portfolio, fetchPortfolio } = usePortfolioStore();
    const holding = portfolio?.holdings?.find(h => h.symbol === symbol);
    const holdingQty = toNumber(holding?.quantity);
    const avgBuyPrice = toNumber(holding?.avgBuyPrice);

    function updateQty(value) {
        const nextQty = Math.max(1, Math.floor(toNumber(value, 1)));
        setQty(Math.min(holdingQty || 1, nextQty));
    }

    const handleSell = async () => {
        if (qty <= 0) return;
        if (qty > holdingQty) {
            onResult("Sell Failed", "Not enough holdings.");
            return;
        }

        setLoading(true);

        try {
            const trade = await sellStock(symbol, qty);
            await fetchPortfolio();
            const total = toNumber(trade.quantity) * toNumber(trade.price);
            onResult(
                "Sell Successful",
                `Sold ${formatNumber(trade.quantity, { maximumFractionDigits: 2 })} shares of ${trade.symbol}\n\nPrice: ${formatCurrency(trade.price)}\nTotal: ${formatCurrency(total)}`
            );
            setQty(1);
        } catch (err) {
            onResult("Sell Failed", err.response?.data?.message || err.message || "Trade failed.");
        } finally {
            setLoading(false);
        }
    };

    if (holdingQty <= 0) return null;

    return (
        <section className="overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-sm">
                        <TrendingDown className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
                            Sell order
                        </p>
                        <h3 className="text-lg font-black text-slate-950">{symbol}</h3>
                    </div>
                </div>
            </div>

            <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                            <PackageCheck className="h-3.5 w-3.5" />
                            Holding
                        </div>
                        <p className="mt-1 text-sm font-black text-slate-900">
                            {formatNumber(holdingQty, { maximumFractionDigits: 2 })} shares
                        </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                        <p className="text-xs font-semibold text-slate-400">Avg buy</p>
                        <p className="mt-1 text-sm font-black text-slate-900">
                            {formatCurrency(avgBuyPrice)}
                        </p>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                        Quantity to sell
                    </label>
                    <div className="grid grid-cols-[44px_1fr_44px] gap-2">
                        <button
                            type="button"
                            onClick={() => setQty(q => Math.max(1, toNumber(q, 1) - 1))}
                            className="flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                            aria-label="Decrease sell quantity"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={holdingQty}
                            value={qty}
                            onChange={(e) => updateQty(e.target.value)}
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-center text-sm font-black text-slate-900 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                        />
                        <button
                            type="button"
                            onClick={() => setQty(q => Math.min(holdingQty, toNumber(q, 1) + 1))}
                            className="flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                            aria-label="Increase sell quantity"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-slate-400">
                            Max: {formatNumber(holdingQty, { maximumFractionDigits: 2 })} shares
                        </p>
                        <button
                            type="button"
                            onClick={() => setQty(holdingQty)}
                            className="text-xs font-black text-rose-600 transition hover:text-rose-800"
                        >
                            Sell all
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSell}
                    disabled={loading || qty > holdingQty || qty <= 0}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400"
                >
                    {loading ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Placing order...
                        </>
                    ) : (
                        `Sell ${formatNumber(qty, { maximumFractionDigits: 0 })} share${qty !== 1 ? "s" : ""}`
                    )}
                </button>
            </div>
        </section>
    );
}

export default SellBox;
