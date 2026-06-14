import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getSupportedStocks } from "../services/stockService";

function MarketsPage() {

    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState("");

    const [filtered, setFiltered] = useState([]);

    useEffect(() => {

        async function load() {

            const s = await getSupportedStocks();

            setStocks(s);
            setFiltered(s);
        }

        load();

    }, []);

    useEffect(() => {

    const query = search.toLowerCase();

    const filteredStocks =
        stocks.filter(stock => {

            const symbolMatch =
                stock.symbol
                    ?.toLowerCase()
                    .includes(query);

            const nameMatch =
                stock.name
                    ?.toLowerCase()
                    ?.includes(query);

            return symbolMatch || nameMatch;
        });

    setFiltered(filteredStocks);

}, [search, stocks]);

    return (

        <div className="space-y-8">

            {/* SEARCH */}
            <input
                className="w-full md:w-96 border px-4 py-2 rounded-lg"
                placeholder="Search stocks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* STOCK GRID */}
            <div className="grid md:grid-cols-4 gap-4">

                {filtered.map(stock => (

                    <Link
                        key={stock.symbol}
                        to={`/stocks/${stock.symbol}`}
                        className="border rounded-xl p-4 hover:shadow"
                    >
                        <p className="font-semibold">
                            {stock.name}
                        </p>
                        <p className="text-sm text-slate-500">
                            {stock.symbol}
                        </p>
                    </Link>

                ))}

            </div>

        </div>

    );
}

export default MarketsPage;