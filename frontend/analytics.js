document.addEventListener("DOMContentLoaded", async () => {
    const intradayContainer = document.getElementById('intraday-suggestions');
    const historicalContainer = document.getElementById('historical-suggestions');

    function renderSuggestionCards(container, data) {
        container.innerHTML = '';
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-muted">No data available right now.</div>';
            return;
        }

        data.forEach(item => {
            const sym = item.symbol.replace('.NS', '');
            const tScore = item.trendScore.toFixed(2);
            const rScore = item.riskScore.toFixed(2);
            const wScore = item.weightedScore.toFixed(2);

            const trendColor = item.trendScore >= 0 ? 'text-green' : 'text-red';
            const riskColor = item.riskScore > 10 ? 'text-red' : (item.riskScore > 5 ? 'text-yellow' : 'text-green');
            
            const card = document.createElement('div');
            card.className = 'flex justify-between items-center p-3 border-b border-gray-800 last:border-0 hover:bg-gray-800 transition-colors rounded';
            card.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="avatar bg-gray-700 text-white font-bold">${sym.charAt(0)}</div>
                    <div>
                        <div class="font-bold text-lg">${sym}</div>
                        <div class="text-xs text-muted">Overall Score: ${wScore}</div>
                    </div>
                </div>
                <div class="flex items-center gap-6 text-right">
                    <div>
                        <div class="text-xs text-muted uppercase">Trend</div>
                        <div class="font-bold ${trendColor}">${tScore}%</div>
                    </div>
                    <div>
                        <div class="text-xs text-muted uppercase">Risk</div>
                        <div class="font-bold ${riskColor}">${rScore}</div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    try {
        const topIntraday = await window.api.getTopIntraday();
        renderSuggestionCards(intradayContainer, topIntraday);
    } catch (e) {
        intradayContainer.innerHTML = '<div class="text-center py-8 text-red">Failed to load intraday data.</div>';
    }

    try {
        const topHistorical = await window.api.getTopHistorical();
        renderSuggestionCards(historicalContainer, topHistorical);
    } catch (e) {
        historicalContainer.innerHTML = '<div class="text-center py-8 text-red">Failed to load historical data.</div>';
    }
});
