import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function StatCard({
    title,
    value,
    icon: Icon = null,
    positive = null,
    helper,
    accent = "teal"
}) {
    const accentClasses = {
        teal: "bg-teal-50 text-teal-700 border-teal-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        blue: "bg-sky-50 text-sky-700 border-sky-100",
        rose: "bg-rose-50 text-rose-700 border-rose-100",
        slate: "bg-slate-100 text-slate-700 border-slate-200"
    };

    let valueColor = "text-slate-950";
    let badgeColor = accentClasses[accent] ?? accentClasses.teal;

    if (positive === true) {
        valueColor = "text-emerald-700";
        badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (positive === false) {
        valueColor = "text-rose-700";
        badgeColor = "bg-rose-50 text-rose-700 border-rose-100";
    }

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-amber-400 to-rose-400 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-500">
                    {title}
                </p>

                {Icon && (
                    <div className={`shrink-0 rounded-xl border p-2.5 ${badgeColor}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                )}
            </div>

            <div className="mt-3 flex items-center gap-2 min-w-0">
                <h2 className={`break-words text-2xl font-black tracking-tight sm:text-3xl ${valueColor}`}>
                    {value}
                </h2>

                {positive === true && (
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-emerald-600" />
                )}

                {positive === false && (
                    <ArrowDownRight className="h-5 w-5 shrink-0 text-rose-600" />
                )}
            </div>

            {helper && (
                <p className="mt-3 text-xs font-medium text-slate-400">
                    {helper}
                </p>
            )}
        </div>
    );
}

export default StatCard;
