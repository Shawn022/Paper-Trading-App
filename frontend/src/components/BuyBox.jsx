import { useState } from "react";
import { Minus, Plus, ShoppingCart, Wallet } from "lucide-react";

import { buyStock } from "../services/tradeService";
import { usePortfolioStore } from "../store/portfolioStore";
import { formatCurrency, formatNumber, toNumber } from "../utils/formatters";

function BuyBox({ symbol, price, onResult }) {
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);
    const { portfolio, fetchPortfolio } = usePortfolioStore();

    const cash = toNumber(portfolio?.balance);
    const currentPrice = toNumber(price);
    const maxQty = currentPrice > 0 ? Math.floor(cash / currentPrice) : 0;
    const orderTotal = currentPrice * qty;
    const isOverBudget = orderTotal > cash || qty <= 0 || maxQty <= 0;

    function decrement() {
        setQty(q => Math.max(1, toNumber(q, 1) - 1));
    }

    function increment() {
        setQty(q => Math.max(1, Math.min(maxQty || 1, toNumber(q, 1) + 1)));
    }

    function updateQty(value) {
        const nextQty = Math.max(1, Math.floor(toNumber(value, 1)));
        setQty(maxQty > 0 ? Math.min(maxQty, nextQty) : nextQty);
    }

    const handleBuy = async () => {
        if (qty <= 0 || isOverBudget) return;
        setLoading(true);

        try {
            const res = await buyStock(symbol, qty);
            await fetchPortfolio();
            onResult(
                `${res.type} Successful`,
                `Bought ${formatNumber(res.quantity, { maximumFractionDigits: 2 })} shares of ${res.symbol} at ${formatCurrency(res.price)}.`
            );
            setQty(1);
        } catch (err) {
            onResult("Buy Failed", err.response?.data?.message || "Trade failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                        <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                            Buy order
                        </p>
                        <h3 className="text-lg font-black text-slate-950">{symbol}</h3>
                    </div>
                </div>
            </div>

            <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                            <Wallet className="h-3.5 w-3.5" />
                            Cash
                        </div>
                        <p className="mt-1 text-sm font-black text-slate-900">
                            {formatCurrency(cash, { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3">
                        <p className="text-xs font-semibold text-slate-400">Order total</p>
                        <p className={`mt-1 text-sm font-black ${isOverBudget ? "text-rose-700" : "text-slate-900"}`}>
                            {formatCurrency(orderTotal)}
                        </p>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                        Quantity
                    </label>
                    <div className="grid grid-cols-[44px_1fr_44px] gap-2">
                        <button
                            type="button"
                            onClick={decrement}
                            className="flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                            aria-label="Decrease buy quantity"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={maxQty || undefined}
                            value={qty}
                            onChange={(e) => updateQty(e.target.value)}
                            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-center text-sm font-black text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                        />
                        <button
                            type="button"
                            onClick={increment}
                            className="flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                            aria-label="Increase buy quantity"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="mt-2 text-xs font-medium text-slate-400">
                        Max affordable: {formatNumber(maxQty, { maximumFractionDigits: 0 })} shares
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleBuy}
                    disabled={loading || isOverBudget}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400"
                >
                    {loading ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Placing order...
                        </>
                    ) : (
                        `Buy ${formatNumber(qty, { maximumFractionDigits: 0 })} share${qty !== 1 ? "s" : ""}`
                    )}
                </button>
            </div>
        </section>
    );
}

export default BuyBox;
