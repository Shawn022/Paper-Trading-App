import { TrendingUp, TrendingDown } from "lucide-react";

function StatCard({
    title,
    value,
    icon: Icon = null,
    positive = null
}) {

    let valueColor = "text-slate-900";
    let badgeColor = "bg-slate-100 text-slate-500";

    if (positive === true) {
        valueColor = "text-green-600";
        badgeColor = "bg-green-50 text-green-600";
    }

    if (positive === false) {
        valueColor = "text-red-600";
        badgeColor = "bg-red-50 text-red-600";
    }

    return (

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 transition-all duration-200 hover:shadow-md hover:border-slate-300">

            <div className="flex items-start justify-between gap-3">

                <p className="text-sm font-medium text-slate-500">
                    {title}
                </p>

                {Icon && (
                    <div className={`shrink-0 rounded-lg p-2 ${badgeColor}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                )}

            </div>

            <div className="mt-2 flex items-center gap-2 min-w-0">

                <h2
                    className={`text-2xl sm:text-3xl font-bold tracking-tight ${valueColor} break-all`}
                >
                    {value}
                </h2>

                {positive === true && (
                    <TrendingUp className="w-4 h-4 text-green-600 shrink-0" />
                )}

                {positive === false && (
                    <TrendingDown className="w-4 h-4 text-red-600 shrink-0" />
                )}

            </div>

        </div>

    );
}

export default StatCard;