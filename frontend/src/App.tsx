import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Inventory from "./pages/Inventory";
import Sidebar from "./components/SideBar";
import Dashboard from "./pages/DashBoard";
import Reports from "./pages/Reports";
import Orders from "./pages/Orders"

function App() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={`
                font-poppins min-h-screen grid transition-all duration-200
                ${collapsed ? "grid-cols-[5rem_1fr]" : "grid-cols-[16rem_1fr]"}
            `}
        >
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <main className="min-w-0">
                <Routes>
                    <Route path="/products" element={<Inventory />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/orders" element={<Orders />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
