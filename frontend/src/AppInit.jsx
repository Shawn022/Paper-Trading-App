import { useEffect } from "react";
import { usePortfolioStore } from "./store/portfolioStore";

function AppInit() {
    const fetchPortfolio = usePortfolioStore(
        (state) => state.fetchPortfolio
    );

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    return null;
}

export default AppInit;