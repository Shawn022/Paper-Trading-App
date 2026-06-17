import { CheckCircle2, XCircle } from "lucide-react";

function TradeResultModal({ open, title, message, type = "success", onClose }) {
    if (!open) return null;

    const isSuccess = type === "success";
    const Icon = isSuccess ? CheckCircle2 : XCircle;

    return (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center">
            <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/25">
                <div className={`flex items-center justify-center px-6 py-8 ${isSuccess ? "bg-emerald-50" : "bg-rose-50"}`}>
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        <Icon className="h-8 w-8" />
                    </div>
                </div>

                <div className="px-6 py-5 text-center">
                    <h2 className={`text-xl font-black ${isSuccess ? "text-emerald-700" : "text-rose-700"}`}>
                        {title}
                    </h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
                        {message}
                    </p>
                </div>

                <div className="px-6 pb-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className={`w-full rounded-2xl py-3 text-sm font-black text-white transition ${isSuccess ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TradeResultModal;
