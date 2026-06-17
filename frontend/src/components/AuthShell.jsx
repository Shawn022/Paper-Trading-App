import { BarChart3, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

function AuthShell({ title, subtitle, children, footer }) {
    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/25 lg:grid-cols-[1fr_0.9fr]">
                <section className="market-grid hidden bg-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xl font-black tracking-tight">Shawn's PaperTrade</p>
                                <p className="text-sm font-medium text-teal-200">Practice desk</p>
                            </div>
                        </div>

                        <div className="mt-20 max-w-md">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-200">
                                Market simulator
                            </p>
                            <h1 className="mt-4 text-5xl font-black tracking-tight">
                                Trade the market without touching real capital.
                            </h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <ShieldCheck className="h-5 w-5 text-teal-200" />
                            <p className="mt-4 text-xs font-semibold text-slate-300">Secure JWT auth</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <TrendingUp className="h-5 w-5 text-emerald-200" />
                            <p className="mt-4 text-xs font-semibold text-slate-300">Live candles</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <Sparkles className="h-5 w-5 text-amber-200" />
                            <p className="mt-4 text-xs font-semibold text-slate-300">Stock signals</p>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center bg-white px-5 py-10 text-slate-950 sm:px-8">
                    <div className="w-full max-w-md">
                        <div className="mb-8 lg:hidden">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-lg font-black tracking-tight">PaperTrade</p>
                                    <p className="text-xs font-semibold text-teal-700">Practice desk</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                                Shawn's PaperTrade
                            </p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                                {title}
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {subtitle}
                            </p>
                        </div>

                        {children}

                        {footer && (
                            <div className="mt-6 text-center text-sm font-medium text-slate-500">
                                {footer}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AuthShell;
