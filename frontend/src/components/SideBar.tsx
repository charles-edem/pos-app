import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FileBarChart,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronsLeft,
} from "lucide-react";

const NAV_ITEMS = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Products", icon: Package },
    { to: "/orders", label: "Orders", icon: ShoppingCart },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/reports", label: "Reports", icon: FileBarChart },
    { to: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
    userName?: string;
    userEmail?: string;
    onLogout?: () => void;
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
    userName = "Admin",
    userEmail = "admin123@example.com",
    onLogout,
    collapsed,
    setCollapsed,
}: SidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between border-b rounded-2xl border-gray-200 bg-white px-4 py-3 font-[family-name:var(--font-poppins)] md:hidden">
                <span className="text-lg font-semibold text-gray-900">Dashboard</span>
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    className="cursor-pointer rounded-xl border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
                />
            )}
            <aside
                className={`
        fixed inset-y-0 left-0 z-50
        flex h-screen flex-col
        border-r border-gray-200
        bg-white
        font-[family-name:var(--font-poppins)]
        transition-all duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${collapsed ? "w-20" : "w-64"}
    `}
            >
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-5">
                    {!collapsed && (
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold text-white">
                                B
                            </div>
                            <span className="truncate text-base font-semibold text-gray-900">
                                Blippe
                            </span>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setCollapsed((c) => !c)}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="hidden align-center flex cursor-pointer rounded-lg p-2 ml-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 md:block"
                    >
                        <ChevronsLeft
                            className={`h-4 w-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                        className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 md:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) => `
                                group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                                transition-colors duration-150
                                ${isActive
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }
                                ${collapsed ? "md:justify-center" : ""}
                            `}
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className={collapsed ? "md:hidden" : ""}>{label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="border-t border-gray-100 p-3">
                    <div
                        className={`flex items-center gap-3 rounded-xl px-2 py-2 ${collapsed ? "md:justify-center" : ""
                            }`}
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                            {userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                        </div>
                        <div className={`min-w-0 flex-1 ${collapsed ? "md:hidden" : ""}`}>
                            <p className="truncate text-sm font-semibold text-gray-900">
                                {userName}
                            </p>
                            <p className="truncate text-xs text-gray-400">{userEmail}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onLogout}
                            aria-label="Log out"
                            className={`shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 ${collapsed ? "md:hidden" : ""
                                }`}
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}