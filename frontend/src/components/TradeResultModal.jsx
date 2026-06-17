function TradeResultModal({ open, title, message, type = "success", onClose }) {
    if (!open) return null;

    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-in">

                {/* Icon stripe */}
                <div className={`flex items-center justify-center h-20 rounded-t-2xl ${isSuccess ? "bg-green-50" : "bg-red-50"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isSuccess ? "bg-green-100" : "bg-red-100"}`}>
                        {isSuccess ? "✓" : "✕"}
                    </div>
                </div>

                <div className="px-6 py-5">
                    <h2 className={`text-lg font-bold text-center mb-1 ${isSuccess ? "text-green-700" : "text-red-700"}`}>
                        {title}
                    </h2>
                    <p className="whitespace-pre-line text-slate-600 text-sm text-center leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="px-6 pb-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className={`w-full py-2.5 rounded-xl font-semibold text-sm text-white transition ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        Done
                    </button>
                </div>

            </div>
        </div>
    );
}

export default TradeResultModal;