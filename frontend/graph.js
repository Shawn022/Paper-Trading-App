document.addEventListener("DOMContentLoaded", async () => {
    const tilesContainer = document.getElementById('stock-tiles-container');
    const chartTitle = document.getElementById('chart-title');
    const tabIntraday = document.getElementById('tab-intraday');
    const tabHistorical = document.getElementById('tab-historical');
    const loadingEl = document.getElementById('chart-loading');
    const canvas = document.getElementById('candleCanvas');
    const ctx = canvas.getContext('2d');

    const infoPrice = document.getElementById('info-price');
    const infoOpen = document.getElementById('info-open');
    const infoHigh = document.getElementById('info-high');
    const infoLow = document.getElementById('info-low');
    const infoChange = document.getElementById('info-change');

    let currentSymbol = null;
    let currentMode = 'intraday';
    let fullStockData = null;

  

    function toSecs(ts) {
        return ts > 1e12 ? Math.floor(ts / 1000) : ts;
    }

    function fmt(n) {
        return typeof n === 'number' ? '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
    }

    function fmtTime(secs, isIntraday) {
        const d = new Date(secs * 1000);
        if (isIntraday) {
            return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }

    //Mock Data Fallback 

    function generateMockCandles(points, intervalMinutes, startPrice) {
        const candles = [];
        let ts = Math.floor(Date.now() / 1000) - (points * intervalMinutes * 60);
        let price = startPrice;
        for (let i = 0; i < points; i++) {
            const v = price * 0.015;
            const open = price;
            const close = open + (Math.random() - 0.48) * v;
            const high = Math.max(open, close) + Math.random() * v * 0.5;
            const low = Math.min(open, close) - Math.random() * v * 0.5;
            candles.push({ timestamp: ts, open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2) });
            price = close;
            ts += intervalMinutes * 60;
        }
        return candles;
    }


    function drawChart(candles, isIntraday) {
        if (!candles || candles.length === 0) {
            loadingEl.textContent = 'No data available';
            loadingEl.style.display = 'flex';
            return;
        }
        loadingEl.style.display = 'none';

        // Resize canvas to device pixel ratio for crisp rendering
        const container = canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        const W = container.clientWidth;
        const H = container.clientHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.scale(dpr, dpr);

        // Margins for axes
        const PAD = { top: 20, right: 70, bottom: 50, left: 12 };
        const chartW = W - PAD.left - PAD.right;
        const chartH = H - PAD.top - PAD.bottom;

        // Sort & dedupe
        const sorted = candles
            .map(c => ({ ...c, timestamp: toSecs(c.timestamp) }))
            .sort((a, b) => a.timestamp - b.timestamp);

        const seen = new Set();
        const data = sorted.filter(c => {
            if (seen.has(c.timestamp)) return false;
            seen.add(c.timestamp);
            return true;
        });

        // Price range
        let priceMin = Infinity, priceMax = -Infinity;
        data.forEach(c => {
            priceMin = Math.min(priceMin, c.low);
            priceMax = Math.max(priceMax, c.high);
        });
        const pricePad = (priceMax - priceMin) * 0.08;
        priceMin -= pricePad;
        priceMax += pricePad;
        const priceRange = priceMax - priceMin;

        // Coordinate helpers
        const xOf = i => PAD.left + (i / (data.length - 1 || 1)) * chartW;
        const yOf = p => PAD.top + (1 - (p - priceMin) / priceRange) * chartH;

        // ── Background
        ctx.clearRect(0, 0, W, H);

        //Grid lines
        const priceSteps = 6;
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= priceSteps; i++) {
            const price = priceMin + (priceRange * i / priceSteps);
            const y = yOf(price);
            ctx.beginPath();
            ctx.moveTo(PAD.left, y);
            ctx.lineTo(W - PAD.right, y);
            ctx.stroke();
        }

        //  Axis Labels (price)
        ctx.fillStyle = '#848E9C';
        ctx.font = '11px Inter, system-ui, sans-serif';
        ctx.textAlign = 'left';
        for (let i = 0; i <= priceSteps; i++) {
            const price = priceMin + (priceRange * i / priceSteps);
            const y = yOf(price);
            ctx.fillText('₹' + price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), W - PAD.right + 6, y + 4);
        }

        //X Axis Labels (time)
        const maxLabels = Math.min(8, data.length);
        const labelStep = Math.floor(data.length / maxLabels);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#848E9C';
        ctx.font = '10px Inter, system-ui, sans-serif';
        for (let i = 0; i < data.length; i += labelStep) {
            const x = xOf(i);
            const label = fmtTime(data[i].timestamp, isIntraday);
            // Vertical tick
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, PAD.top);
            ctx.lineTo(x, PAD.top + chartH);
            ctx.stroke();
            // Label below chart
            ctx.fillStyle = '#848E9C';
            ctx.fillText(label, x, H - PAD.bottom + 18);
        }

        //Candle width
        const candleW = Math.max(2, Math.min(14, (chartW / data.length) * 0.7));

        // ── Draw candles
        data.forEach((c, i) => {
            const x = xOf(i);
            const isUp = c.close >= c.open;
            const color = isUp ? '#2ebd85' : '#F6465D';

            // Wick
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, yOf(c.high));
            ctx.lineTo(x, yOf(c.low));
            ctx.stroke();

            // Body
            const bodyTop = yOf(Math.max(c.open, c.close));
            const bodyBottom = yOf(Math.min(c.open, c.close));
            const bodyH = Math.max(1, bodyBottom - bodyTop);

            ctx.fillStyle = color;
            ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
        });

        // ── Axes borders
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        // bottom
        ctx.beginPath();
        ctx.moveTo(PAD.left, PAD.top + chartH);
        ctx.lineTo(W - PAD.right, PAD.top + chartH);
        ctx.stroke();
        // right (price axis)
        ctx.beginPath();
        ctx.moveTo(W - PAD.right, PAD.top);
        ctx.lineTo(W - PAD.right, PAD.top + chartH);
        ctx.stroke();

        // ── Update info bar from last candle
        const last = data[data.length - 1];
        const first = data[0];
        const change = last.close - first.open;
        const changePct = (change / first.open) * 100;
        const isPositive = change >= 0;

        infoPrice.textContent = fmt(last.close);
        infoOpen.textContent = fmt(last.open);
        infoHigh.textContent = fmt(last.high);
        infoLow.textContent = fmt(last.low);
        infoChange.textContent = (isPositive ? '+' : '') + change.toFixed(2) + ' (' + changePct.toFixed(2) + '%)';
        infoChange.className = 'stock-info-value ' + (isPositive ? 'val-green' : 'val-red');
    }


    function renderChartData() {
        if (!fullStockData) return;
        const isIntraday = currentMode === 'intraday';
        const candles = isIntraday ? fullStockData.intradayCandles : fullStockData.historicalCandles;
        drawChart(candles, isIntraday);
    }

    

    async function bootstrapChart(symbol) {
        loadingEl.textContent = 'Loading chart data…';
        loadingEl.style.display = 'flex';
        fullStockData = null;

        const displayLabel = symbol.replace('.NS', '');
        chartTitle.textContent = `Market Activity — ${displayLabel}`;

        [infoPrice, infoOpen, infoHigh, infoLow, infoChange].forEach(el => el.textContent = '—');

        let response = await window.api.getStockHistory(symbol);

        if (!response || !response.intradayCandles || response.intradayCandles.length === 0) {
            const sp = Math.random() * 1800 + 200;
            response = {
                symbol,
                intradayCandles: generateMockCandles(78, 5, sp),
                historicalCandles: generateMockCandles(90, 1440, sp * 0.85)
            };
        }

        fullStockData = response;
        renderChartData();
    }

    

    function setTab(mode) {
        currentMode = mode;
        tabIntraday.classList.toggle('active', mode === 'intraday');
        tabHistorical.classList.toggle('active', mode === 'historical');
        renderChartData();
    }

    tabIntraday.addEventListener('click', () => setTab('intraday'));
    tabHistorical.addEventListener('click', () => setTab('historical'));

    let allStocks = [];
    const TILE_COLORS = ['tc-0', 'tc-1', 'tc-2', 'tc-3', 'tc-4', 'tc-5'];

    function renderTiles(filter) {
        tilesContainer.innerHTML = '';
        const q = (filter || '').toUpperCase().trim();

        let list = allStocks.filter(st => {
            const sym = st.symbol.replace('.NS', '');
            return !q || sym.includes(q);
        });
        if (q) {
            list.sort((a, b) => {
                const sa = a.symbol.replace('.NS', ''), sb = b.symbol.replace('.NS', '');
                const aStarts = sa.startsWith(q) ? 0 : 1;
                const bStarts = sb.startsWith(q) ? 0 : 1;
                if (aStarts !== bStarts) return aStarts - bStarts;
                return sa.localeCompare(sb);
            });
        }

        list.forEach((st, idx) => {
            const sym = st.symbol.replace('.NS', '');
            const tile = document.createElement('div');
            const colorClass = TILE_COLORS[idx % TILE_COLORS.length];
            tile.className = `stock-tile ${colorClass}`;
            tile.dataset.value = st.symbol;
            tile.textContent = sym;
            if (st.symbol === currentSymbol) tile.classList.add('active');

            tile.addEventListener('click', () => {
                tilesContainer.querySelectorAll('.stock-tile').forEach(t => t.classList.remove('active'));
                tile.classList.add('active');
                currentSymbol = st.symbol;
                try { window.history.replaceState({}, '', `?symbol=${st.symbol}`); } catch (e) { }
                bootstrapChart(st.symbol);
            });
            tilesContainer.appendChild(tile);
        });
    }

    try {
        allStocks = (await window.api.getAllStocks()) || [];
        renderTiles('');
    } catch (err) {
        console.error('Failed to load stocks', err);
    }

    const searchInput = document.getElementById('graph-search');
    if (searchInput) {
        searchInput.addEventListener('input', e => renderTiles(e.target.value));
    }

   

    const urlParams = new URLSearchParams(window.location.search);
    const symbolParam = urlParams.get('symbol');
    currentSymbol = symbolParam ? symbolParam.toUpperCase() : null;

    
    setTimeout(() => {
        if (!currentSymbol) {
            const first = tilesContainer.querySelector('.stock-tile');
            if (first) currentSymbol = first.dataset.value;
        }
        if (currentSymbol) {
            const tile = tilesContainer.querySelector(`.stock-tile[data-value="${currentSymbol}"]`);
            if (tile) tile.classList.add('active');
            bootstrapChart(currentSymbol);
        }
    }, 300);

    
    window.addEventListener('resize', () => { if (fullStockData) renderChartData(); });

   
    const bbsKSelect    = document.getElementById('bbs-k');
    const bbsRefreshBtn = document.getElementById('bbs-refresh');
    const bbsSymbolLbl  = document.getElementById('bbs-symbol-label');

    function renderBBSResult(containerId, data, isIntraday) {
        const el = document.getElementById(containerId);
        if (!el) return;

        if (!data) {
            el.innerHTML = '<span style="color:#848E9C;font-size:0.85rem;">⚡ Could not connect to backend. Make sure the server is running.</span>';
            return;
        }

        const label     = isIntraday ? 'candle' : 'day';
        const rawTxns   = data.transactions || [];
        const nums      = Array.isArray(data.nums) ? data.nums : [];
        const maxProfit = data.maxProfit != null ? data.maxProfit : null;

        if (rawTxns.length === 0) {
            el.innerHTML = '<span style="color:#F59E0B;font-size:0.85rem;">⚠ No profitable trades found for this period with the selected k.</span>';
            return;
        }

        const rows = rawTxns.map((t, i) => {
            let buyIdx, sellIdx, buyPrice, sellPrice, profit;

            if (Array.isArray(t)) {
                // Standard backend format: [buyDayIndex, sellDayIndex]
                buyIdx    = t[0];
                sellIdx   = t[1];
                buyPrice  = (nums.length > 0 && buyIdx  >= 0 && buyIdx  < nums.length && nums[buyIdx]  !== undefined) ? nums[buyIdx]  : null;
                sellPrice = (nums.length > 0 && sellIdx >= 0 && sellIdx < nums.length && nums[sellIdx] !== undefined) ? nums[sellIdx] : null;
                profit    = (buyPrice !== null && sellPrice !== null)
                              ? Math.round((sellPrice - buyPrice) * 100) / 100
                              : null;
            } else {
    
                buyIdx    = (t.buyIndex  !== undefined) ? t.buyIndex  : ((t['0'] !== undefined) ? t['0'] : '?');
                sellIdx   = (t.sellIndex !== undefined) ? t.sellIndex : ((t['1'] !== undefined) ? t['1'] : '?');
                buyPrice  = (t.buyPrice  !== undefined) ? parseFloat(t.buyPrice)
                              : (buyIdx !== '?' && nums[buyIdx] !== undefined ? nums[buyIdx] : null);
                sellPrice = (t.sellPrice !== undefined) ? parseFloat(t.sellPrice)
                              : (sellIdx !== '?' && nums[sellIdx] !== undefined ? nums[sellIdx] : null);
                profit    = (t.profit !== undefined) ? parseFloat(t.profit)
                              : ((buyPrice !== null && sellPrice !== null)
                                  ? Math.round((sellPrice - buyPrice) * 100) / 100
                                  : null);
            }

            const buyPx  = buyPrice  !== null ? '₹' + parseFloat(buyPrice).toLocaleString('en-IN',{minimumFractionDigits:2})  : '—';
            const sellPx = sellPrice !== null ? '₹' + parseFloat(sellPrice).toLocaleString('en-IN',{minimumFractionDigits:2}) : '—';
            const profitColor = profit === null ? '#848E9C' : profit >= 0 ? '#2ebd85' : '#F6465D';
            const profitStr   = profit !== null
                ? `${profit >= 0 ? '+' : ''}₹${Math.abs(profit).toLocaleString('en-IN',{minimumFractionDigits:2})}`
                : '';

            return `
            <div style="display:flex;justify-content:space-between;align-items:center;
                        padding:9px 12px;background:rgba(255,255,255,0.03);
                        border-radius:8px;margin-bottom:6px;border:1px solid rgba(255,255,255,0.06);">
                <div style="font-size:0.85rem;line-height:1.6;">
                    <span style="color:#848E9C;font-size:0.72rem;margin-right:6px;font-weight:600;">TX${i+1}</span>
                    <span style="font-weight:700;color:#2ebd85;">BUY</span>&nbsp;${label}&nbsp;#${buyIdx}&nbsp;@&nbsp;${buyPx}
                    &nbsp;<span style="color:#848E9C;">→</span>&nbsp;
                    <span style="font-weight:700;color:#F6465D;">SELL</span>&nbsp;${label}&nbsp;#${sellIdx}&nbsp;@&nbsp;${sellPx}
                </div>
                ${profitStr ? `<div style="font-weight:700;color:${profitColor};font-size:0.85rem;white-space:nowrap;">${profitStr}</div>` : ''}
            </div>`;
        }).join('');

        const badge = maxProfit !== null
            ? `<div style="margin-bottom:10px;padding:6px 10px;background:rgba(46,189,133,0.07);
                           border-radius:6px;border:1px solid rgba(46,189,133,0.2);font-size:0.82rem;color:#848E9C;">
                   Max Profit:&nbsp;
                   <strong style="color:${parseFloat(maxProfit)>=0?'#2ebd85':'#F6465D'};">₹${parseFloat(maxProfit).toLocaleString('en-IN',{minimumFractionDigits:2})}</strong>
               </div>`
            : '';

        el.innerHTML = badge + rows;
    }

    async function loadBestBuySell(symbol) {
        if (!symbol) return;
        const k = parseInt(bbsKSelect?.value || '1', 10);
        if (bbsSymbolLbl) bbsSymbolLbl.textContent = `— ${symbol.replace('.NS', '')}`;

        const loadingHtml = '<span style="color:#848E9C;font-size:0.85rem;">⏳ Fetching strategy…</span>';
        const inEl = document.getElementById('bbs-intraday-result');
        const hiEl = document.getElementById('bbs-historical-result');
        if (inEl) inEl.innerHTML = loadingHtml;
        if (hiEl) hiEl.innerHTML = loadingHtml;

        let intradayData = null, historicalData = null;
        try {
            [intradayData, historicalData] = await Promise.all([
                window.api.getBestBuySellIntraday(symbol, k),
                window.api.getBestBuySellHistorical(symbol, k)
            ]);
        } catch (err) {
            console.error('[BBS] Fetch error:', err);
        }

        renderBBSResult('bbs-intraday-result',   intradayData,   true);
        renderBBSResult('bbs-historical-result', historicalData, false);
    }

    if (bbsRefreshBtn) bbsRefreshBtn.addEventListener('click', () => { if (currentSymbol) loadBestBuySell(currentSymbol); });
    if (bbsKSelect)    bbsKSelect.addEventListener('change',   () => { if (currentSymbol) loadBestBuySell(currentSymbol); });

    const _origBootstrap = bootstrapChart;
    bootstrapChart = async (symbol) => {
        await _origBootstrap(symbol);
        loadBestBuySell(symbol);
    };
});

