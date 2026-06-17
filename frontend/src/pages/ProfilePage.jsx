import { useEffect, useState } from "react";
import {
    AlertCircle,
    BadgeCheck,
    CalendarDays,
    IdCard,
    Mail,
    ShieldCheck,
    UserCircle,
    Wallet
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import api from "../services/api";
import { usePortfolioStore } from "../store/portfolioStore";
import { formatCurrency, toNumber } from "../utils/formatters";

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map(word => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function ProfileStat({ label, value, tone = "slate" }) {
    const tones = {
        teal: "bg-teal-50 text-teal-700",
        amber: "bg-amber-50 text-amber-700",
        emerald: "bg-emerald-50 text-emerald-700",
        rose: "bg-rose-50 text-rose-700",
        slate: "bg-slate-100 text-slate-700"
    };

    return (
        <div className={`rounded-2xl px-4 py-3 ${tones[tone]}`}>
            <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-70">
                {label}
            </p>
            <p className="mt-1 text-lg font-black tabular-nums">
                {value}
            </p>
        </div>
    );
}

function DetailRow({ label, value, icon: Icon }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                {Icon && <Icon className="h-4 w-4 text-slate-300" />}
                {label}
            </div>
            <div className="min-w-0 text-right text-sm font-bold text-slate-900">
                {value ?? "--"}
            </div>
        </div>
    );
}

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { portfolio, fetchPortfolio } = usePortfolioStore();

    useEffect(() => {
        if (!portfolio) {
            fetchPortfolio();
        }
    }, [fetchPortfolio, portfolio]);

    useEffect(() => {
        api.get("/api/auth/me")
            .then(res => setUser(res.data))
            .catch(err => setError(err.response?.data?.message || "Failed to load profile."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
                    <span className="text-sm font-semibold text-slate-500">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-center shadow-sm">
                    <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
                    <p className="mt-3 text-sm font-semibold text-rose-700">{error}</p>
                </div>
            </div>
        );
    }

    const balance = toNumber(user?.balance ?? portfolio?.balance);
    const invested = toNumber(portfolio?.holdingsValue);
    const pnl = toNumber(portfolio?.unrealisedPnL);
    const isProfit = pnl >= 0;
    const joinedAt = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        : "Not available";

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8">
            <PageHeader
                eyebrow="Account"
                title="Profile"
                description="Identity, access status, and portfolio snapshot for your paper-trading account."
                icon={UserCircle}
            />

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="market-grid border-b border-slate-100 bg-slate-50 p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-2xl font-black text-white shadow-lg shadow-slate-900/15">
                                {getInitials(user?.name)}
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate text-3xl font-black tracking-tight text-slate-950">
                                    {user?.name}
                                </h1>
                                <p className="mt-1 truncate text-sm font-medium text-slate-500">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-black text-emerald-700 ring-1 ring-emerald-100 sm:self-center">
                            <ShieldCheck className="h-4 w-4" />
                            {user?.role ?? "Trader"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
                    <ProfileStat
                        label="Cash"
                        value={formatCurrency(balance)}
                        tone="teal"
                    />
                    <ProfileStat
                        label="Invested"
                        value={formatCurrency(invested)}
                        tone="amber"
                    />
                    <ProfileStat
                        label="Unrealised P/L"
                        value={`${isProfit ? "+" : ""}${formatCurrency(pnl)}`}
                        tone={isProfit ? "emerald" : "rose"}
                    />
                </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-2 shadow-sm">
                <DetailRow label="User ID" value={user?.id} icon={IdCard} />
                <DetailRow label="Name" value={user?.name} icon={UserCircle} />
                <DetailRow label="Email" value={user?.email} icon={Mail} />
                <DetailRow label="Member since" value={joinedAt} icon={CalendarDays} />
                <DetailRow
                    label="Account status"
                    icon={BadgeCheck}
                    value={
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${user?.active !== false ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                            {user?.active !== false ? "Active" : "Suspended"}
                        </span>
                    }
                />
                <DetailRow label="Cash source" value="Paper balance" icon={Wallet} />
            </section>
        </div>
    );
}

export default ProfilePage;
