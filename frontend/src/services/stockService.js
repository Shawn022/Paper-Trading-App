import api from "./api";

export async function getStock(symbol) {

    const response = await api.get(
        `/api/stock/${symbol}/history`
    );

    return response.data;
}

export async function getSupportedStocks() {

    const response =
        await api.get(
            "/api/stock/supported"
        );

    return response.data;
}