import { create } from "zustand";
import { getPortfolio } from "../services/portfolioService";

export const usePortfolioStore = create((set) => ({
    portfolio: null,
    loading: false,

    setPortfolio: (data) => set({ portfolio: data }),

    fetchPortfolio: async () => {
        const { loading } = usePortfolioStore.getState();

        if (loading) return;

        set({ loading: true });

        try {
            const data = await getPortfolio();
            set({ portfolio: data });
        }finally {
            set({ loading: false });
        }
    },
    
}));