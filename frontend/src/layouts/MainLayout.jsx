import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {

    return (
        <div className="min-h-screen bg-slate-50 ">

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-6">

                <Outlet />

            </main>

        </div>
    );
}

export default MainLayout;