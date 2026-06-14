import { useState } from "react";

import BuyBox from "./BuyBox";
import SellBox from "./SellBox";
import TradeResultModal from "./TradeResultModal";

function TradeBox({ symbol, price }) {

    const [modal, setModal] = useState({
        open: false,
        title: "",
        message: "",
    });

    function showResult(title, message) {

        setModal({
            open: true,
            title,
            message,
        });
    }

    return (
        <>
            <div className="space-y-4">

                <BuyBox
                    symbol={symbol}
                    price={price}
                    onResult={showResult}
                />

                <SellBox
                    symbol={symbol}
                    onResult={showResult}
                />

            </div>

            <TradeResultModal
                open={modal.open}
                title={modal.title}
                message={modal.message}
                onClose={() =>
                    setModal({
                        open: false,
                        title: "",
                        message: "",
                    })
                }
            />
        </>
    );
}

export default TradeBox;