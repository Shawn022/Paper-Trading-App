function StatCard({
    title,
    value,
    positive = null
}) {

    let valueColor = "text-slate-900";

    if (positive === true) {
        valueColor = "text-green-600";
    }

    if (positive === false) {
        valueColor = "text-red-600";
    }

    return (

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">

            <p className="text-sm text-slate-500">
                {title}
            </p>

            <h2
                className={`mt-2 text-3xl font-bold ${valueColor}`}
            >
                {value}
            </h2>

        </div>

    );
}

export default StatCard;