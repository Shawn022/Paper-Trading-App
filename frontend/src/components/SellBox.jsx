import { useState } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { sellStock } from "../services/tradeService";

function SellBox({ symbol, onResult }) {
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);

    const { portfolio, fetchPortfolio } = usePortfolioStore();
    const holding = portfolio?.holdings?.find(h => h.symbol === symbol);
    const holdingQty = holding?.quantity || 0;
    const avgBuyPrice = holding?.avgBuyPrice || 0;

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
            const total = Number(trade.quantity) * Number(trade.price);
            onResult(
                "Sell Successful",
                `Sold ${trade.quantity} shares of ${trade.symbol}\n\nPrice: ₹${Number(trade.price).toLocaleString("en-IN")}\nTotal: ₹${total.toLocaleString("en-IN")}`
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
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-red-50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm font-bold text-red-800 uppercase tracking-widest">Sell {symbol}</span>
                </div>
            </div>

            <div className="px-5 py-4 space-y-4">
                {/* Holdings summary */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-slate-400 mb-0.5">Holding</p>
                        <p className="text-sm font-semibold text-slate-800">{holdingQty} shares</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-slate-400 mb-0.5">Avg buy price</p>
                        <p className="text-sm font-semibold text-slate-800 tabular-nums">
                            ₹{Number(avgBuyPrice).toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>

                {/* Qty input */}
                <div>
                    <label className="text-xs text-slate-400 font-medium mb-1.5 block">Quantity to sell</label>
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
                            max={holdingQty}
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, Math.min(holdingQty, Number(e.target.value))))}
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-center text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setQty(q => Math.min(holdingQty, q + 1))}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-lg transition"
                        >
                            +
                        </button>
                    </div>
                    <div className="flex justify-between mt-1.5">
                        <p className="text-xs text-slate-400">Max: {holdingQty} shares</p>
                        <button
                            type="button"
                            onClick={() => setQty(holdingQty)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                        >
                            Sell all
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSell}
                    disabled={loading || qty > holdingQty || qty <= 0}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Placing order…
                        </>
                    ) : (
                        `Sell ${qty} share${qty !== 1 ? "s" : ""}`
                    )}
                </button>
            </div>
        </div>
    );
}

export default SellBox;