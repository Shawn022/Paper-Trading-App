import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    function logout() {

        localStorage.removeItem("token");

        navigate("/login");
    }

    return (

        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-6">

                <div className="h-16 flex items-center justify-between">

                    <Link
                        to="/dashboard"
                        className="text-xl font-bold text-slate-900"
                    >
                        PaperTrade
                    </Link>

                    <nav className="flex items-center gap-6">

                        <Link
                            to="/"
                            className="text-slate-600 hover:text-slate-900"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/markets"
                            className="text-slate-600 hover:text-slate-900"
                        >
                            Markets
                        </Link>

                        <Link
                            to="/portfolio"
                            className="text-slate-600 hover:text-slate-900"
                        >
                            Portfolio
                        </Link>

                        <Link
                            to="/history"
                            className="text-slate-600 hover:text-slate-900"
                        >
                            History
                        </Link>

                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700"
                        >
                            Logout
                        </button>

                    </nav>

                </div>

            </div>

        </header>
    );
}

export default Navbar;