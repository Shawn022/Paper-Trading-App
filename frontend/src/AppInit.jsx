import { useEffect } from "react";
import { usePortfolioStore } from "./store/portfolioStore";
import { connectWebSocket, disconnectWebSocket } from "./services/websocket";

function AppInit() {
    const fetchPortfolio = usePortfolioStore(
        (state) => state.fetchPortfolio
    );

    useEffect(() => {
        fetchPortfolio();

    }, [fetchPortfolio]);

    useEffect(() => {
        connectWebSocket();

        return () => disconnectWebSocket();
    }, []);

    return null;
}

export default AppInit;
