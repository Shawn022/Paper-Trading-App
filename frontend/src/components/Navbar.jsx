import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
    { to: "/", label: "Dashboard" },
    { to: "/markets", label: "Markets" },
    { to: "/portfolio", label: "Portfolio" },
    { to: "/history", label: "History" },
    { to: "/profile", label: "Profile"},
];

function Navbar() {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    function logout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    function desktopLinkClass({ isActive }) {
        return `text-sm font-medium transition-colors ${isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
            }`;
    }

    function mobileLinkClass({ isActive }) {
        return `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`;
    }

    return (

        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="h-16 flex items-center justify-between">

                    <Link
                        to="/"
                        className="text-xl font-bold text-slate-900"
                        onClick={() => setOpen(false)}
                    >
                        Shawn's PaperTrade
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-6">

                        {LINKS.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={desktopLinkClass}
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                        >
                            Logout
                        </button>

                    </nav>

                    {/* MOBILE TOGGLE */}
                    <button
                        onClick={() => setOpen(prev => !prev)}
                        className="md:hidden p-2 -mr-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                    >
                        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                </div>

            </div>

            {/* MOBILE NAV */}
            {open && (
                <nav className="md:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-3 space-y-1">

                    {LINKS.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className={mobileLinkClass}
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    <button
                        onClick={logout}
                        className="w-full mt-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                    >
                        Logout
                    </button>

                </nav>
            )}

        </header>
    );
}

export default Navbar;