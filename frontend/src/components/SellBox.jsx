import { useState } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { sellStock } from "../services/tradeService";

function SellBox({
    symbol,
    onResult
}) {

    const [qty, setQty] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    const {
        portfolio,
        fetchPortfolio
    } = usePortfolioStore();

    const holding =
        portfolio?.holdings?.find(
            h => h.symbol === symbol
        );

    const holdingQty =
        holding?.quantity || 0;

    const avgBuyPrice =
        holding?.avgBuyPrice || 0;

    const handleSell =
        async () => {

            if (qty <= 0)
                return;

            if (
                qty > holdingQty
            ) {

                onResult(
                    "Sell Failed",
                    "Not enough holdings."
                );

                return;
            }

            setLoading(true);

            try {

                const res =
                    await sellStock(
                        symbol,
                        qty
                    );

                await fetchPortfolio();

                const trade =
                    res.data;

                const total =
                    Number(
                        trade.quantity
                    ) *
                    Number(
                        trade.price
                    );

                onResult(
                    "Sell Successful",

                    `Sold ${trade.quantity} shares of ${trade.symbol}

Price: ₹${Number(
                        trade.price
                    ).toLocaleString(
                        "en-IN"
                    )}

Total: ₹${total.toLocaleString(
                        "en-IN"
                    )}`
                );

                setQty(1);

            } catch (err) {

                onResult(
                    "Sell Failed",

                    err.response
                        ?.data
                        ?.message ||

                    err.message ||

                    "Trade failed."
                );

            } finally {

                setLoading(false);
            }
        };

    if (
        holdingQty <= 0
    ) {
        return null;
    }

    return (
        <div className="bg-white border border-red-200 rounded-xl p-4 space-y-3">

            <h2 className="text-lg font-bold text-red-600">
                SELL {symbol}
            </h2>

            <div className="text-sm text-slate-500">
                Holding:
                <span className="font-medium text-slate-800 ml-1">
                    {holdingQty}
                </span>
            </div>

            <div className="text-sm text-slate-500">
                Bought At:
                <span className="font-medium text-slate-800 ml-1">
                    {avgBuyPrice}
                </span>
            </div>

            <input
                type="number"
                min="1"
                max={holdingQty}
                value={qty}
                onChange={(e) =>
                    setQty(
                        Number(
                            e.target.value
                        )
                    )
                }
                className="w-full border px-3 py-2 rounded"
            />

            <button
                type="button"
                onClick={handleSell}
                disabled={
                    loading ||
                    qty >
                    holdingQty
                }
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
            >
                SELL
            </button>

            <div className="text-xs text-slate-400">
                Max Sell:
                {" "}
                {holdingQty}
            </div>

        </div>
    );
}

export default SellBox;