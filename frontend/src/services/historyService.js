import api from "./api";

export async function getTradeHistory() {

    const response =
        await api.get(
            "/api/user/trades"
        );

    return response.data;
}