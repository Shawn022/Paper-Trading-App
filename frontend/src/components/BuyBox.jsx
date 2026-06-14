import { useState } from "react";
import { buyStock } from "../services/tradeService";
import { usePortfolioStore } from "../store/portfolioStore";

function BuyBox({
    symbol,
    price,
    onResult
}) {
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);

    const { portfolio, fetchPortfolio } = usePortfolioStore();

    const cash = portfolio?.balance || 0;

    const handleBuy = async () => {

        if (qty <= 0 ) return;

        setLoading(true);

        try {

            const res = await buyStock(
                symbol,
                qty
            );

            await fetchPortfolio();

            const trade =
                res.data;

            onResult(
                `${trade.type} Successful`,
                `${trade.type} ${trade.quantity} shares of ${trade.symbol} at ₹${trade.price}.`
            );

            setQty(1);

        } catch (err) {

            onResult(
                "Buy Failed",
                err.response?.data?.message ||
                "Trade failed."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-green-200 rounded-xl p-4 space-y-3">

            <h2 className="text-lg font-bold text-green-600">
                BUY {symbol}
            </h2>

            <div className="text-sm text-slate-500">
                Cash: ₹ {Number(cash).toLocaleString("en-IN")}
            </div>
            <div className="text-sm text-slate-500">
                Price: ₹ {Number(price * qty).toLocaleString("en-IN")}
            </div>

            <input
                type="number"
                min="1"
                max={Math.floor(cash / price)}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded"
            />

            <button
                type="button"
                onClick={handleBuy}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
            >
                BUY
            </button>

            <div className="text-xs text-slate-400">
                Max Buy approx: {Math.floor(cash / price)}
            </div>

        </div>
    );
}

export default BuyBox;