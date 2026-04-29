document.addEventListener("DOMContentLoaded", async () => {
    const valueEl = document.getElementById('portfolio-value');
    const balanceEl = document.getElementById('portfolio-balance');
    const plEl = document.getElementById('portfolio-pl');
    const holdingsList = document.getElementById('holdings-list');
    
    if (currentUser) {
        try {
            const portfolio = await window.api.getPortfolio(currentUser.id);
            const cashBalance = portfolio.balance;
            balanceEl.textContent = cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            
            const holdingsMap = portfolio.holdings || {};
            const symbols = Object.keys(holdingsMap);
            
            if (symbols.length === 0) {
                holdingsList.innerHTML = '<div class="text-center py-8 text-muted">No active stock holdings. Visit Trading to buy stocks!</div>';
                valueEl.textContent = cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                plEl.textContent = '₹0.00 (0.00%)';
                plEl.className = 'text-3xl font-bold mt-2 text-muted';
                return;
            }

            holdingsList.innerHTML = '';
            let stocksValue = 0;

            for (const symbol of symbols) {
                const qty = holdingsMap[symbol];
                const livePrice = await window.api.getStockPrice(symbol);
                const holdingTotal = qty * livePrice;
                stocksValue += holdingTotal;

                const safeId = symbol.replace(/[^a-zA-Z0-9]/g, '_');

                const row = document.createElement('div');
                row.className = 'flex justify-between items-center p-4 rounded-lg dashboard-row-anim';
                row.style.backgroundColor = 'var(--bg-surface-hover)';
                row.innerHTML = `
                    <div class="flex flex-col">
                        <a href="graph.html?symbol=${symbol}" class="font-bold text-xl text-primary" style="text-decoration: underline; text-underline-offset: 4px;" title="View ${symbol} Chart">${symbol}</a>
                        <span class="text-muted text-sm">${qty.toLocaleString()} Shares</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <div class="text-lg font-bold" id="holding-total-${safeId}">₹${holdingTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                            <div class="text-muted text-sm">
                                @ <span id="holding-price-${safeId}" style="transition: color 0.4s;">₹${livePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                <span id="holding-change-${safeId}" style="margin-left:6px;font-size:0.75rem;"></span>
                            </div>
                        </div>
                        <button class="btn btn-red sell-btn" data-symbol="${symbol}" data-qty="${qty}">Sell</button>
                    </div>
                `;
                holdingsList.appendChild(row);
            }

            
            const priceCache = {};
            setInterval(async () => {
                for (const symbol of symbols) {
                    try {
                        const safeId   = symbol.replace(/[^a-zA-Z0-9]/g, '_');
                        const qty      = holdingsMap[symbol];
                        const newPrice = await window.api.getStockPrice(symbol);
                        const oldPrice = priceCache[symbol];
                        priceCache[symbol] = newPrice;

                        const priceEl  = document.getElementById(`holding-price-${safeId}`);
                        const totalEl  = document.getElementById(`holding-total-${safeId}`);
                        const changeEl = document.getElementById(`holding-change-${safeId}`);
                        if (!priceEl) continue;

                        
                        if (oldPrice !== undefined && newPrice !== oldPrice) {
                            priceEl.style.color = newPrice > oldPrice ? '#2ebd85' : '#F6465D';
                            setTimeout(() => { priceEl.style.color = ''; }, 800);
                        }

                        priceEl.textContent = '₹' + newPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                        if (totalEl) {
                            const newTotal = qty * newPrice;
                            totalEl.textContent = '₹' + newTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                        }
                        if (changeEl && oldPrice) {
                            const diff = newPrice - oldPrice;
                            const pct  = (diff / oldPrice) * 100;
                            changeEl.textContent = (diff >= 0 ? '▲' : '▼') + ' ' + Math.abs(pct).toFixed(2) + '%';
                            changeEl.style.color = diff >= 0 ? '#2ebd85' : '#F6465D';
                        }
                    } catch (e) {}
                }
            }, 5000);

            const totalPortfolioValue = cashBalance + stocksValue;
            valueEl.textContent = totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            const initialBalance = 100000.00;
            const absolutePL = totalPortfolioValue - initialBalance;
            const percentPL = (absolutePL / initialBalance) * 100;

            const sign = absolutePL >= 0 ? '+' : '';
            const plText = `${sign}₹${Math.abs(absolutePL).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${sign}${percentPL.toFixed(2)}%)`;
            
            plEl.textContent = plText;
            if (absolutePL > 0) plEl.className = 'text-3xl font-bold mt-2 text-green';
            else if (absolutePL < 0) plEl.className = 'text-3xl font-bold mt-2 text-red';
            else plEl.className = 'text-3xl font-bold mt-2 text-muted';
            
            const sellModal = document.getElementById('sell-modal');
            const closeSellBtn = document.getElementById('close-sell-modal');
            const modalSellSymbol = document.getElementById('modal-sell-symbol');
            const sellLivePriceEl = document.getElementById('sell-live-price');
            const sellQtyInput = document.getElementById('sell-quantity');
            const maxSellQtyEl = document.getElementById('max-sell-qty');
            const sellTotalValueEl = document.getElementById('sell-total-value');
            const executeSellBtn = document.getElementById('execute-sell-btn');
            const sellAlertBox = document.getElementById('sell-alert-box');

            let activeSellSymbol = null;
            let activeSellCurrentPrice = 0;
            let activeMaxQty = 0;
            let sellPricePollInterval = null;

            document.querySelectorAll('.sell-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const symbol = e.target.dataset.symbol;
                    const maxQty = parseFloat(e.target.dataset.qty);
                    openSellModal(symbol, maxQty);
                });
            });

            function calcSellTotal() {
                const qty = parseFloat(sellQtyInput.value) || 0;
                sellTotalValueEl.textContent = (qty * activeSellCurrentPrice).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            }

            sellQtyInput.addEventListener('input', () => {
                if(parseFloat(sellQtyInput.value) > activeMaxQty) {
                    sellQtyInput.value = activeMaxQty;
                }
                calcSellTotal();
            });

            function openSellModal(symbol, maxQty) {
                activeSellSymbol = symbol;
                activeMaxQty = maxQty;
                modalSellSymbol.textContent = symbol;
                maxSellQtyEl.textContent = maxQty;
                sellQtyInput.value = maxQty; 
                sellQtyInput.max = maxQty;
                sellLivePriceEl.textContent = '--.--';
                sellTotalValueEl.textContent = '0.00';
                activeSellCurrentPrice = 0;
                sellAlertBox.style.display = 'none';
                executeSellBtn.disabled = false;
                
                sellModal.classList.add('show');
                
                if (sellPricePollInterval) clearInterval(sellPricePollInterval);
                updateSellModalPrice(symbol);
                sellPricePollInterval = setInterval(() => updateSellModalPrice(symbol), 1500);
            }

            function closeSellModal() {
                sellModal.classList.remove('show');
                activeSellSymbol = null;
                if (sellPricePollInterval) clearInterval(sellPricePollInterval);
            }

            closeSellBtn.addEventListener('click', closeSellModal);
            sellModal.addEventListener('click', (e) => {
                if(e.target === sellModal) closeSellModal();
            });

            async function updateSellModalPrice(sym) {
                if (!sym) return;
                try {
                    const price = await window.api.getStockPrice(sym);
                    if (activeSellSymbol !== sym) return;
                    activeSellCurrentPrice = price;
                    sellLivePriceEl.textContent = price.toLocaleString(undefined, {minimumFractionDigits:2});
                    calcSellTotal();
                } catch(e) {}
            }

            executeSellBtn.addEventListener('click', async () => {
                if (!activeSellSymbol) return;
                const qty = parseFloat(sellQtyInput.value);
                if (qty <= 0 || qty > activeMaxQty) return;
                
                sellAlertBox.style.display = 'none';
                executeSellBtn.disabled = true;

                try {
                    await window.api.executeTrade(currentUser.id, activeSellSymbol, 'SELL', qty, activeSellCurrentPrice);
                    sellAlertBox.textContent = `Successfully sold ${qty} ${activeSellSymbol}!`;
                    sellAlertBox.className = 'alert alert-success mt-4';
                    sellAlertBox.style.display = 'block';
                    
                    setTimeout(() => {
                        closeSellModal();
                        window.location.reload();
                    }, 1500);
                } catch(error) {
                    sellAlertBox.textContent = error.message;
                    sellAlertBox.className = 'alert alert-error mt-4';
                    sellAlertBox.style.display = 'block';
                    executeSellBtn.disabled = false;
                }
            });

        } catch (err) {
            console.error(err);
    
            const mockPortfolio = {
                balance: 85002.50,
                holdings: {
                    "AAPL.NS": 12,
                    "TCS.NS": 25,
                    "MSFT.NS": 5
                }
            };
            
            const cashBalance = mockPortfolio.balance;
            balanceEl.textContent = cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            let stocksValue = 0;
            holdingsList.innerHTML = '';
            
            for (const symbol of Object.keys(mockPortfolio.holdings)) {
                const qty = mockPortfolio.holdings[symbol];
                const livePrice = Math.random() * 500 + 50; 
                const holdingTotal = qty * livePrice;
                stocksValue += holdingTotal;

                const row = document.createElement('div');
                row.className = 'flex justify-between items-center p-4 rounded-lg dashboard-row-anim';
                row.style.backgroundColor = 'var(--bg-surface-hover)';
                row.innerHTML = `
                    <div class="flex flex-col">
                        <a href="graph.html?symbol=${symbol}" class="font-bold text-xl text-primary" style="text-decoration: underline; text-underline-offset: 4px;" title="View ${symbol} Chart">${symbol}</a>
                        <span class="text-muted text-sm">${qty.toLocaleString()} Shares</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <div class="text-lg font-bold">₹${holdingTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                            <div class="text-muted text-sm">@ ₹${livePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        </div>
                        <button class="btn btn-red sell-btn" data-symbol="${symbol}" data-qty="${qty}">Sell</button>
                    </div>
                `;
                holdingsList.appendChild(row);
            }
            
    
            document.querySelectorAll('.sell-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const symbol = e.target.dataset.symbol;
                    const maxQty = parseFloat(e.target.dataset.qty);
                    openSellModal(symbol, maxQty);
                });
            });
            
        
            const totalPortfolioValue = cashBalance + stocksValue;
            valueEl.textContent = totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const absolutePL = totalPortfolioValue - 100000;
            const percentPL = (absolutePL / 100000) * 100;
            const sign = absolutePL >= 0 ? '+' : '';
            plEl.textContent = `${sign}₹${Math.abs(absolutePL).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${sign}${percentPL.toFixed(2)}%)`;
            plEl.className = 'text-3xl font-bold mt-2 text-red';
        }
    }

    function buildFallbackScores() {
        if (!window.MASTER_STOCKS) return [];
        return window.MASTER_STOCKS.map(s => ({
            symbol: s.symbol,
            trendScore:    parseFloat((Math.random() * 40 - 8).toFixed(2)),
            weightedScore: parseFloat((Math.random() * 30 - 5).toFixed(2))
        })).sort((a, b) => b.weightedScore - a.weightedScore);
    }

    function renderTop10(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const top10 = data.slice(0, 10);
        if (top10.length === 0) {
            container.innerHTML = '<div style="color:#848E9C;text-align:center;padding:16px;font-size:0.875rem;">No data available</div>';
            return;
        }
        container.innerHTML = top10.map((item, i) => {
            const sym   = item.symbol.replace('.NS', '');
            const trend = typeof item.trendScore === 'number' ? item.trendScore : 0;
            const isUp  = trend >= 0;
            const color = isUp ? '#2ebd85' : '#F6465D';
            const arrow = isUp ? '▲' : '▼';
            const name  = (window.MASTER_STOCKS || []).find(s => s.symbol === item.symbol)?.name || sym;
            return `<div onclick="window.location.href='graph.html?symbol=${item.symbol}'"
                     style="display:flex;justify-content:space-between;align-items:center;
                            padding:8px 10px;border-radius:8px;cursor:pointer;margin-bottom:4px;
                            background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);
                            transition:background 0.18s;"
                     onmouseenter="this.style.background='rgba(255,255,255,0.07)'"
                     onmouseleave="this.style.background='rgba(255,255,255,0.02)'">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-size:0.7rem;color:#848E9C;width:16px;text-align:right;font-weight:600;">${i + 1}</span>
                        <div style="width:32px;height:32px;border-radius:50%;background:${color}22;border:1.5px solid ${color};
                                    display:flex;align-items:center;justify-content:center;
                                    font-weight:800;font-size:0.8rem;color:${color};">${sym.charAt(0)}</div>
                        <div>
                            <div style="font-weight:700;font-size:0.88rem;">${sym}</div>
                            <div style="font-size:0.68rem;color:#848E9C;">${name}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:700;color:${color};font-size:0.88rem;">${arrow} ${Math.abs(trend).toFixed(2)}%</div>
                        <div style="font-size:0.68rem;color:#848E9C;">Score: ${typeof item.weightedScore === 'number' ? item.weightedScore.toFixed(1) : '—'}</div>
                    </div>
                </div>`;
        }).join('');
    }

    (async () => {
        const loadMsg = '<div style="color:#848E9C;text-align:center;padding:16px;font-size:0.875rem;">Loading...</div>';
        const inEl  = document.getElementById('dash-intraday-top');
        const hiEl  = document.getElementById('dash-historical-top');
        if (inEl)  inEl.innerHTML  = loadMsg;
        if (hiEl)  hiEl.innerHTML  = loadMsg;

        const [intraday, historical] = await Promise.all([
            window.api.getTopIntraday().catch(() => null),
            window.api.getTopHistorical().catch(() => null)
        ]);

        const fb = buildFallbackScores();
        renderTop10('dash-intraday-top',   (intraday   && intraday.length   > 0) ? intraday   : fb);
        renderTop10('dash-historical-top', (historical && historical.length > 0) ? historical : [...fb].sort((a,b) => b.trendScore - a.trendScore));
    })();
});
