
const BASE_URL = 'http://localhost:8080/api';


window.MASTER_STOCKS = [
    { symbol: "HDFCBANK.NS",   name: "HDFC Bank" },
    { symbol: "ICICIBANK.NS",  name: "ICICI Bank" },
    { symbol: "SBIN.NS",       name: "State Bank of India" },
    { symbol: "AXISBANK.NS",   name: "Axis Bank" },
    { symbol: "KOTAKBANK.NS",  name: "Kotak Bank" },
    { symbol: "BAJFINANCE.NS", name: "Bajaj Finance" },
    { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv" },
    { symbol: "HDFCLIFE.NS",   name: "HDFC Life" },
    { symbol: "SBILIFE.NS",    name: "SBI Life" },
    { symbol: "INDUSINDBK.NS", name: "IndusInd Bank" },
    { symbol: "TCS.NS",        name: "Tata Consultancy" },
    { symbol: "INFY.NS",       name: "Infosys" },
    { symbol: "HCLTECH.NS",    name: "HCL Tech" },
    { symbol: "WIPRO.NS",      name: "Wipro" },
    { symbol: "TECHM.NS",      name: "Tech Mahindra" },
    { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
    { symbol: "RELIANCE.NS",   name: "Reliance Industries" },
    { symbol: "ONGC.NS",       name: "ONGC" },
    { symbol: "NTPC.NS",       name: "NTPC" },
    { symbol: "POWERGRID.NS",  name: "Power Grid" },
    { symbol: "BPCL.NS",       name: "BPCL" },
    { symbol: "COALINDIA.NS",  name: "Coal India" },
    { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever" },
    { symbol: "ITC.NS",        name: "ITC" },
    { symbol: "NESTLEIND.NS",  name: "Nestle India" },
    { symbol: "BRITANNIA.NS",  name: "Britannia" },
    { symbol: "TATACONSUM.NS", name: "Tata Consumer" },
    { symbol: "MARUTI.NS",     name: "Maruti Suzuki" },
    { symbol: "M&M.NS",        name: "Mahindra & Mahindra" },
    { symbol: "EICHERMOT.NS",  name: "Eicher Motors" },
    { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto" },
    { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp" },
    { symbol: "SUNPHARMA.NS",  name: "Sun Pharma" },
    { symbol: "DRREDDY.NS",    name: "Dr Reddy's" },
    { symbol: "CIPLA.NS",      name: "Cipla" },
    { symbol: "DIVISLAB.NS",   name: "Divi's Labs" },
    { symbol: "APOLLOHOSP.NS", name: "Apollo Hospitals" },
    { symbol: "TATASTEEL.NS",  name: "Tata Steel" },
    { symbol: "JSWSTEEL.NS",   name: "JSW Steel" },
    { symbol: "HINDALCO.NS",   name: "Hindalco" },
    { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement" },
    { symbol: "GRASIM.NS",     name: "Grasim" },
    { symbol: "ADANIENT.NS",   name: "Adani Enterprises" },
    { symbol: "ADANIPORTS.NS", name: "Adani Ports" },
    { symbol: "LT.NS",         name: "L&T" },
    { symbol: "SHRIRAMFIN.NS", name: "Shriram Finance" },
    { symbol: "TITAN.NS",      name: "Titan" },
    { symbol: "TRENT.NS",      name: "Trent" },
    { symbol: "ASIANPAINT.NS", name: "Asian Paints" },
    { symbol: "SBICARD.NS",    name: "SBI Cards" },
    { symbol: "BEL.NS",        name: "Bharat Electronics" }
];

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
                const data = await response.json();
                
                if (data && data.length > 0) {
                    const backendSymbols = new Set(data.map(s => s.symbol));
                    const extras = window.MASTER_STOCKS.filter(s => !backendSymbols.has(s.symbol));
                    return [...data, ...extras];
                }
            }
            return window.MASTER_STOCKS;
        } catch (error) {
            return window.MASTER_STOCKS;
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
    },

    getTopIntraday: async () => {
        try {
            const response = await fetch(`${BASE_URL}/suggestion/top-intraday`).catch(() => null);
            if (response && response.ok) return await response.json();
            return [];
        } catch (error) { return []; }
    },

    getTopHistorical: async () => {
        try {
            const response = await fetch(`${BASE_URL}/suggestion/top-historical`).catch(() => null);
            if (response && response.ok) return await response.json();
            return [];
        } catch (error) { return []; }
    },

    
    getBestBuySellIntraday: async (symbol, k = 1) => {
        try {
            const response = await fetch(`${BASE_URL}/suggestion/BestBuySell/intraday?symbol=${encodeURIComponent(symbol)}&k=${k}`).catch(() => null);
            if (response && response.ok) return await response.json();
            return null;
        } catch (error) { return null; }
    },

    
    getBestBuySellHistorical: async (symbol, k = 1) => {
        try {
            const response = await fetch(`${BASE_URL}/suggestion/BestBuySell/historical?symbol=${encodeURIComponent(symbol)}&k=${k}`).catch(() => null);
            if (response && response.ok) return await response.json();
            return null;
        } catch (error) { return null; }
    }
};
