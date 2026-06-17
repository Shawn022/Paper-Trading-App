const currencyFormatters = new Map();

export function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

export function formatCurrency(value, options = {}) {
    const maximumFractionDigits = options.maximumFractionDigits ?? 2;
    const minimumFractionDigits =
        options.minimumFractionDigits ?? Math.min(2, maximumFractionDigits);

    const key = `${minimumFractionDigits}-${maximumFractionDigits}`;

    if (!currencyFormatters.has(key)) {
        currencyFormatters.set(
            key,
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits,
                maximumFractionDigits
            })
        );
    }

    return currencyFormatters.get(key).format(toNumber(value));
}

export function formatNumber(value, options = {}) {
    return toNumber(value).toLocaleString("en-IN", options);
}

export function formatPercent(value, digits = 2) {
    return `${toNumber(value).toFixed(digits)}%`;
}

export function getChangeTone(value) {
    return toNumber(value) >= 0 ? "positive" : "negative";
}
