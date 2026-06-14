export function addPriceLine(series, price) {

    if (!series || !price) return;

    return series.createPriceLine({
        price,
        color: "red",
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
    });
}