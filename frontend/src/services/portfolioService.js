import api from "./api";

export const getPortfolio = async () => {
    const res = await api.get("/api/user/portfolio");
    return res.data;
};