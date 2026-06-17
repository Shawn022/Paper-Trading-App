import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    BarChart3,
    BriefcaseBusiness,
    Clock3,
    LayoutDashboard,
    LogOut,
    Menu,
    Search,
    ShieldCheck,
    UserCircle,
    X
} from "lucide-react";

const LINKS = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/markets", label: "Markets", icon: BarChart3 },
    { to: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
    { to: "/history", label: "History", icon: Clock3 },
    { to: "/profile", label: "Profile", icon: UserCircle }
];

function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    function logout() {
        localStorage.removeItem("token");
        setOpen(false);
        navigate("/login");
    }

    function desktopLinkClass({ isActive }) {
        return `group flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all ${isActive
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm"
            }`;
    }

    function mobileLinkClass({ isActive }) {
        return `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${isActive
                ? "bg-slate-950 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`;
    }

    return (
        <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-[72px] items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="flex min-w-0 items-center gap-3"
                        onClick={() => setOpen(false)}
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15">
                            <BarChart3 className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-base font-black tracking-tight text-slate-950">
                                Shawn's PaperTrade
                            </p>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-teal-700">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Practice desk</span>
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-100/80 p-1 md:flex">
                        {LINKS.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `group flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all ${isActive
                                        ? "bg-slate-950 text-white shadow-sm"
                                        : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                                        <span className={isActive ? "text-white" : ""}>
                                            {label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        <Link
                            to="/markets"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
                            title="Search markets"
                            aria-label="Search markets"
                        >
                            <Search className="h-4 w-4" />
                        </Link>

                        <button
                            type="button"
                            onClick={logout}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm transition hover:bg-slate-800"
                            title="Logout"
                            aria-label="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpen(prev => !prev)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {open && (
                <nav className="border-t border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-900/5 md:hidden">
                    <div className="space-y-1">
                        {LINKS.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={() => setOpen(false)}
                                className={mobileLinkClass}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </nav>
            )}
        </header>
    );
}

export default Navbar;
