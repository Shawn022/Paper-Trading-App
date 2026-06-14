import api from "./api";

export async function buyStock(symbol, quantity) {

    const response = await api.post(
        "/api/user/trade/buy",
        {
            symbol,
            quantity
        }
    );

    return response.data;
}

export async function sellStock(symbol, quantity) {

    const response = await api.post(
        "/api/user/trade/sell",
        {
            symbol,
            quantity
        }
    );

    return response.data;
}