import { useEffect, useState } from "react";
import api from "../services/api";
import { usePortfolioStore } from "../store/portfolioStore";

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map(w => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function StatCard({ label, value, sub }) {
    return (
        <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
            <p className="text-lg font-bold text-slate-800 tabular-nums leading-tight">{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
    );
}

function Row({ label, value, mono }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-400">{label}</span>
            <span className={`text-sm font-medium text-slate-800 ${mono ? "tabular-nums font-mono" : ""}`}>
                {value ?? "—"}
            </span>
        </div>
    );
}

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {portfolio} = usePortfolioStore();

    useEffect(() => {
        api.get("/api/auth/me")
            .then(res => setUser(res.data))
            .catch(err => setError(err.response?.data?.message || "Failed to load profile."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-slate-400 font-medium">Loading profile…</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-2">
                    <p className="text-3xl">⚠️</p>
                    <p className="text-sm text-slate-500">{error}</p>
                </div>
            </div>
        );
    }

    const balance = Number(user.balance ?? 0);
    const invested = Number(portfolio.holdingsValue ?? 0);
    const pnl = Number(portfolio.unrealisedPnL ?? 0);
    const isProfit = pnl >= 0;
    const joinedAt = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : null;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

                {/* Avatar + name card */}
                <div className="bg-white border border-slate-200 rounded-2xl px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-xl font-bold tracking-tight">
                            {getInitials(user.name)}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-slate-900 truncate">{user.name}</h1>
                        <p className="text-sm text-slate-400 truncate mt-0.5">{user.email}</p>
                        {joinedAt && (
                            <p className="text-xs text-slate-400 mt-1">Member since {joinedAt}</p>
                        )}
                    </div>
                    <span className="self-start sm:self-center bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {user.role ?? "Trader"}
                    </span>
                </div>

                {/* Portfolio snapshot */}
                <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-3 px-1">
                        Portfolio snapshot
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <StatCard
                            label="Cash balance"
                            value={`₹${balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        />
                        <StatCard
                            label="Total invested"
                            value={`₹${invested.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        />
                        <div className={`rounded-xl px-4 py-3 col-span-2 sm:col-span-1 ${isProfit ? "bg-green-50" : "bg-red-50"}`}>
                            <p className={`text-xs font-medium mb-0.5 ${isProfit ? "text-green-600" : "text-red-500"}`}>
                                Unrealised P&amp;L
                            </p>
                            <p className={`text-lg font-bold tabular-nums leading-tight ${isProfit ? "text-green-700" : "text-red-700"}`}>
                                {isProfit ? "+" : ""}₹{pnl.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account details */}
                <div className="bg-white border border-slate-200 rounded-2xl px-5 py-1">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-4 mb-1">
                        Account details
                    </p>
                    <Row label="User ID" value={user.id} mono />
                    <Row label="Username" value={user.name} />
                    <Row label="Email" value={user.email} />
                    <Row label="Account status" value={
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            user.active !== false
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                        }`}>
                            {user.active !== false ? "Active" : "Suspended"}
                        </span>
                    } />
                </div>

            </div>
        </div>
    );
}

export default ProfilePage;