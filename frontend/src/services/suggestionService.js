import api from "./api";

export async function getTopIntraday() {
    const res = await api.get("/api/suggestion/top/intraday");
    return res.data;
}

export async function getTopHistorical() {
    const res = await api.get("/api/suggestion/top/history");
    return res.data;
}

export async function getBestBuySellIntraday(symbol, k = 3) {
    const res = await api.get(
        `/api/suggestion/buy-sell/intraday`,
        {
            params: { symbol, k }
        }
    );
    return res.data;
}

export async function getBestBuySellHistorical(symbol, k = 3) {
    const res = await api.get(
        `/api/suggestion/buy-sell/historical`,
        {
            params: { symbol, k }
        }
    );
    return res.data;
}