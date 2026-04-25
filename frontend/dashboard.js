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

                const row = document.createElement('div');
                row.className = 'flex justify-between items-center p-4 rounded-lg';
                row.style.backgroundColor = 'var(--bg-surface-hover)';
                row.innerHTML = `
                    <div class="flex flex-col">
                        <a href="graph.html?symbol=${symbol}" class="font-bold text-xl text-primary" style="text-decoration: underline; text-underline-offset: 4px;" title="View ${symbol} Chart">${symbol}</a>
                        <span class="text-muted text-sm">${qty.toLocaleString()} Shares</span>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-bold">₹${holdingTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        <div class="text-muted text-sm">@ ₹${livePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>
                `;
                holdingsList.appendChild(row);
            }

            const totalPortfolioValue =  stocksValue;
            valueEl.textContent = totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            const initialBalance = 100000.00;
            const absolutePL = (totalPortfolioValue+ cashBalance) - initialBalance;
            const percentPL = (absolutePL / initialBalance) * 100;

            const sign = absolutePL >= 0 ? '+' : '';
            const plText = `${sign}₹${Math.abs(absolutePL).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${sign}${percentPL.toFixed(2)}%)`;
            
            plEl.textContent = plText;
            if (absolutePL > 0) plEl.className = 'text-3xl font-bold mt-2 text-green';
            else if (absolutePL < 0) plEl.className = 'text-3xl font-bold mt-2 text-red';
            else plEl.className = 'text-3xl font-bold mt-2 text-muted';

        } catch (err) {
            holdingsList.innerHTML = '<div class="text-center py-8 text-red">Error loading portfolio</div>';
        }
    }
});
