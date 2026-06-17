import { useState } from "react";
import { buyStock } from "../services/tradeService";
import { usePortfolioStore } from "../store/portfolioStore";

function BuyBox({ symbol, price, onResult }) {
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);
    const { portfolio, fetchPortfolio } = usePortfolioStore();

    const cash = portfolio?.balance || 0;
    const maxQty = Math.floor(cash / price);
    const orderTotal = Number(price * qty);
    const isOverBudget = orderTotal > cash || qty <= 0;

    const handleBuy = async () => {
        if (qty <= 0) return;
        setLoading(true);
        try {
            const res = await buyStock(symbol, qty);
            await fetchPortfolio();
            onResult(
                `${res.type} Successful`,
                `Bought ${res.quantity} shares of ${res.symbol} at ₹${Number(res.price).toLocaleString("en-IN")}.`
            );
            setQty(1);
        } catch (err) {
            onResult("Buy Failed", err.response?.data?.message || "Trade failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-green-50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-bold text-green-800 uppercase tracking-widest">Buy {symbol}</span>
                </div>
            </div>

            <div className="px-5 py-4 space-y-4">
                {/* Balance row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-slate-400 mb-0.5">Available cash</p>
                        <p className="text-sm font-semibold text-slate-800 tabular-nums">
                            ₹{Number(cash).toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-slate-400 mb-0.5">Order total</p>
                        <p className={`text-sm font-semibold tabular-nums ${isOverBudget ? "text-red-600" : "text-slate-800"}`}>
                            ₹{orderTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Qty input */}
                <div>
                    <label className="text-xs text-slate-400 font-medium mb-1.5 block">Quantity</label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setQty(q => Math.max(1, q - 1))}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-lg transition"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={maxQty}
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-center text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-lg transition"
                        >
                            +
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Max: {maxQty} shares</p>
                </div>

                <button
                    type="button"
                    onClick={handleBuy}
                    disabled={loading || isOverBudget}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Placing order…
                        </>
                    ) : (
                        `Buy ${qty} share${qty !== 1 ? "s" : ""}`
                    )}
                </button>
            </div>
        </div>
    );
}

export default BuyBox;