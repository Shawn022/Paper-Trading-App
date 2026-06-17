import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
