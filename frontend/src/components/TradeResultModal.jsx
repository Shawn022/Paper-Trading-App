function TradeResultModal({
    open,
    title,
    message,
    onClose
}) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-96 shadow-xl">

                <h2 className="text-xl font-bold mb-4">
                    {title}
                </h2>

                <p className="whitespace-pre-line text-slate-700 mb-6">
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                    Confirm
                </button>

            </div>

        </div>
    );
}

export default TradeResultModal;