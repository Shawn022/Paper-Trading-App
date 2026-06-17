import { useState } from "react";

import BuyBox from "./BuyBox";
import SellBox from "./SellBox";
import TradeResultModal from "./TradeResultModal";

function TradeBox({ symbol, price }) {
    const [modal, setModal] = useState({ open: false, title: "", message: "", type: "" });

    function showResult(title, message) {
        const type = title.toLowerCase().includes("fail") ? "error" : "success";
        setModal({ open: true, title, message, type });
    }

    return (
        <>
            <div className="space-y-4">
                <BuyBox symbol={symbol} price={price} onResult={showResult} />
                <SellBox symbol={symbol} onResult={showResult} />
            </div>

            <TradeResultModal
                open={modal.open}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal({ open: false, title: "", message: "", type: "" })}
            />
        </>
    );
}

export default TradeBox;