
const BASE_URL = 'http://localhost:8080/api';

window.api = {
    login: async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    },

    signup: async (name, email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error('Could not register');
            }

            return await window.api.login(email, password);
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    },

    getPortfolio: async (userId) => {
        let holdings = {};
        let balance = 100000.00;

        try {

            const response = await fetch(`${BASE_URL}/user/${userId}/portfolio`).catch(() => null);
            if (response && response.status === 404) {
                return { balance, holdings };
            }
            if (response && response.ok) {
                const data = await response.json();
                data.forEach(item => {
                    const sym = item.stockSymbol || item.symbol;
                    if (sym) {
                        holdings[sym] = item.quantity;
                    }
                });
            }

            const history = await window.api.getHistory(userId);
            let spent = 0;
            let earned = 0;
            if (history && history.length > 0) {
                history.forEach(trade => {
                    const totalTradeValue = trade.quantity * trade.price;
                    if (trade.type && trade.type.toUpperCase() === 'BUY') {
                        spent += totalTradeValue;
                    } else if (trade.type && trade.type.toUpperCase() === 'SELL') {
                        earned += totalTradeValue;
                    }
                });
            }
            balance = balance - spent + earned;

            return { balance, holdings };
        } catch (error) {
            return { balance: balance, holdings: holdings };
        }
    },

    getStockPrice: async (symbol) => {
        try {
            const response = await fetch(`${BASE_URL}/stock/${symbol}`).catch(() => null);
            if (response && response.ok) {
                return await response.json();
            }
            return 150.00; 
        } catch (error) {
            return 150.00;
        }
    },

    getAllStocks: async () => {
        try {
            const response = await fetch(`${BASE_URL}/stock`).catch(() => null);
            if (response && response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            return [];
        }
    },

    getStockHistory: async (symbol) => {
        try {
            const response = await fetch(`${BASE_URL}/stock/${symbol}/history`).catch(() => null);
            if (response && response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            return null;
        }
    },

    executeTrade: async (userId, symbol, type, quantity, currentPrice) => {
        try {
            const route = type.toLowerCase() === 'buy' ? 'buy' : 'sell';
            const response = await fetch(`${BASE_URL}/user/${userId}/trade/${route}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: symbol,
                    quantity: parseFloat(quantity)
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Trade failed');
            }

            return { success: true };
        } catch (error) {
            throw new Error(error.message || 'Network error trading');
        }
    },

    getHistory: async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/user/${userId}/trades`).catch(() => null);
            if (response && response.ok) {
                const history = await response.json();
                return history.map(h => ({
                    id: h.id,
                    userId: userId,
                    date: h.timestamp || new Date().toISOString(),
                    symbol: h.stockSymbol || h.symbol,
                    type: h.type || h.tradeType || h.action,
                    quantity: h.quantity,
                    price: h.price,
                    total: h.quantity * h.price
                })).reverse();
            }
            return [];
        } catch (error) {
            return [];
        }
    }
};
