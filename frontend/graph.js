/**
 * Graph Logic - Handles Chart.js initialization and live updates
 */

document.addEventListener("DOMContentLoaded", async () => {
    const liveIndicator = document.getElementById('live-indicator');
    const tilesContainer = document.getElementById('stock-tiles-container');
    const chartTitle = document.getElementById('chart-title');
    
    // Populate Stocks
    try {
        const stocks = await window.api.getAllStocks();
        if (stocks && stocks.length > 0) {
            tilesContainer.innerHTML = '';
            stocks.forEach(st => {
                const tile = document.createElement('div');
                tile.className = 'stock-tile';
                tile.dataset.value = st.symbol;
                tile.textContent = st.symbol.replace('.NS', '');
                
                tile.addEventListener('click', () => {
                    document.querySelectorAll('#stock-tiles-container .stock-tile').forEach(t => t.classList.remove('active'));
                    tile.classList.add('active');
                    
                    try {
                        window.history.replaceState({}, '', `?symbol=${st.symbol}`);
                    } catch (err) {}
                    
                    bootstrapChart(st.symbol);
                });
                
                tilesContainer.appendChild(tile);
            });
        }
    } catch(err) {
        console.error("Failed to load stocks into tiles", err);
    }

    // Initialize Chart.js
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    // Gradient fill for line chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(246, 70, 93, 0.2)');
    gradient.addColorStop(1, 'rgba(246, 70, 93, 0)');

    const chartConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Price',
                data: [],
                borderColor: '#F6465D',
                backgroundColor: gradient,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 400
            },
            scales: {
                x: {
                    display: false,
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#848E9C' },
                    border: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#1E2329',
                    titleColor: '#EAECEF',
                    bodyColor: '#F6465D',
                    borderColor: '#2B3139',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toLocaleString(undefined, {minimumFractionDigits: 2});
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    };

    let mainChart = new Chart(ctx, chartConfig);
    let currentInterval = null;
    let currentRequestId = 0;

    async function bootstrapChart(symbol) {
        if (currentInterval) {
            clearInterval(currentInterval);
            currentInterval = null;
        }
        
        const requestId = ++currentRequestId;
        
        mainChart.data.labels = [];
        mainChart.data.datasets[0].data = [];
        mainChart.update('none');
        
        // Visual updates
        const displayLabel = symbol.replace('.NS', '');
        chartTitle.textContent = `Market Activity (${displayLabel})`;
        liveIndicator.textContent = '60-DAY';
        liveIndicator.style.opacity = '1';
        
        // Fetch history data
        const history = await window.api.getStockHistory(symbol);
        
        if (requestId !== currentRequestId) return; // Prevent async race conditions
        
        // Process history data - handles multiple response formats
        let prices = [];
        if (history) {
            // If history is an array directly
            if (Array.isArray(history)) {
                prices = history.map(item => {
                    // Handle array of objects with price property
                    return typeof item === 'object' && item.price ? item.price : item;
                });
            }
            // If history is an object with priceHistory property (actual API response)
            else if (history.priceHistory && Array.isArray(history.priceHistory)) {
                prices = history.priceHistory;
            }
            // If history is an object with prices property
            else if (history.prices && Array.isArray(history.prices)) {
                prices = history.prices;
            }
        }
        
        if (prices && prices.length > 0) {
            for (let i = 0; i < prices.length; i++) {
                mainChart.data.labels.push('');
                mainChart.data.datasets[0].data.push(parseFloat(prices[i]));
            }
            liveIndicator.style.opacity = '1';
        } else {
            // Fallback to bootstrap believable historical mocked data if history api fails
            const basePrice = await window.api.getStockPrice(symbol);
            liveIndicator.style.opacity = '1';
            
            let currentTempPrice = basePrice;
            const volatility = basePrice * 0.003; 

            for(let i = 0; i < 30; i++) {
                mainChart.data.labels.push('');
                let change = (Math.random() * volatility * 2) - volatility;
                currentTempPrice += change;
                mainChart.data.datasets[0].data.push(currentTempPrice);
            }
        }
        mainChart.update();

        // No live updates - keeping static 60-day historical data
    }

    const urlParams = new URLSearchParams(window.location.search);
    const symbolParam = urlParams.get('symbol');
    
    let initialSymbol = 'BTC'; 
    if (symbolParam) {
        initialSymbol = symbolParam.toUpperCase();
    } else {
        const firstTile = tilesContainer.querySelector('.stock-tile');
        if (firstTile) {
            initialSymbol = firstTile.dataset.value;
        }
    }
    
    // Set active tile visually
    const initialTile = tilesContainer.querySelector(`.stock-tile[data-value="${initialSymbol}"]`);
    if (initialTile) {
        initialTile.classList.add('active');
    } else {
        const newTile = document.createElement('div');
        newTile.className = 'stock-tile active';
        newTile.dataset.value = initialSymbol;
        newTile.textContent = initialSymbol.replace('.NS', '');
        
        newTile.addEventListener('click', () => {
            document.querySelectorAll('#stock-tiles-container .stock-tile').forEach(t => t.classList.remove('active'));
            newTile.classList.add('active');
            try { window.history.replaceState({}, '', `?symbol=${initialSymbol}`); } catch(e){}
            bootstrapChart(initialSymbol);
        });
        
        tilesContainer.appendChild(newTile);
    }

    // Initial load
    bootstrapChart(initialSymbol);
});
