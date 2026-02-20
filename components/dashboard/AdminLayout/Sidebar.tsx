"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

/* ======================================================
TYPES
====================================================== */
type NavItem = {
    label: string;
    icon: string;
    href: string;
    badge?: string;
};

type NavSection = {
    title: string;
    items: NavItem[];
};

/* ======================================================
NAV CONFIG
====================================================== */
const NAV_SECTIONS: NavSection[] = [
    {
        title: "MENU",
        items: [
            { label: "Dashboard", icon: "solar:widget-bold", href: "/dashboard" },
            { label: "transactions", icon: "solar:checklist-bold", href: "/dashboard/transactions" },
            { label: "Demandes", icon: "solar:checklist-bold", href: "/dashboard/demandes", badge: "12+" },
            { label: "Realisations", icon: "solar:checklist-bold", href: "/dashboard/realisations" },
            { label: "Boutiques", icon: "solar:checklist-bold", href: "/dashboard/store" },
            { label: "Liste des boutiques", icon: "solar:checklist-bold", href: "/dashboard/boutiques" },
            { label: "Management", icon: "solar:settings-bold", href: "/dashboard/management" },
            { label: "Configurations", icon: "solar:settings-bold", href: "/dashboard/configurations" },
            { label: "Calendar", icon: "solar:calendar-bold", href: "/dashboard/calendar" },
            { label: "Analytics", icon: "solar:chart-square-bold", href: "/dashboard/analytics" },
            { label: "Team", icon: "solar:users-group-two-rounded-bold", href: "/dashboard/team" },
        ],
    },
    {
        title: "GENERAL",
        items: [
            { label: "Settings", icon: "solar:settings-bold", href: "/dashboard/settings" },
            { label: "Help", icon: "solar:question-circle-bold", href: "/help" },
            { label: "Logout", icon: "solar:logout-3-bold", href: "/logout" },
        ],
    },
];

/* ======================================================
SIDEBAR
====================================================== */
interface SidebarProps {
    mobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
}

export default function Sidebar({
    mobileMenuOpen,
    toggleMobileMenu,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* ================= Desktop Sidebar ================= */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#F8F9F7] border-r px-6 py-6 flex-col">
                <SidebarContent pathname={pathname} />
            </aside>

            {/* ================= Mobile Overlay ================= */}
            <div
                className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleMobileMenu}
            />

            {/* ================= Mobile Sidebar ================= */}
            <aside
                className={`fixed bottom-0 left-0 w-full bg-[#F8F9F7] z-40 md:hidden transform transition-transform duration-300 ${mobileMenuOpen ? "translate-y-0" : "translate-y-full"
                    } rounded-t-xl px-6 py-6 h-[80%] flex flex-col`}
            >
                <div className="flex justify-end mb-4">
                    <button
                        onClick={toggleMobileMenu}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        <Icon icon="solar:close-square-bold" className="w-5 h-5" />
                    </button>
                </div>

                <SidebarContent pathname={pathname} />
            </aside>
        </>
    );
}

/* ======================================================
SIDEBAR CONTENT
====================================================== */
interface SidebarContentProps {
    pathname: string | null;
}

function SidebarContent({ pathname }: SidebarContentProps) {
    return (
        <>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-full bg-brand-primary2" />
                <span className="font-bold text-lg">Admin</span>
            </div>

            {/* Navigation */}
            {NAV_SECTIONS.map((section) => (
                <div key={section.title} className="mb-10">
                    <div className="text-xs text-gray-400 mb-3">{section.title}</div>

                    <nav className="space-y-2">
                        {section.items.map((item) => (
                            <MenuItem
                                key={item.label}
                                {...item}
                                active={pathname === item.href}
                            />
                        ))}
                    </nav>
                </div>
            ))}
        </>
    );
}

/* ======================================================
MENU ITEM
====================================================== */
interface MenuItemProps {
    icon: string;
    label: string;
    href: string;
    badge?: string;
    active?: boolean;
}

function MenuItem({ icon, label, href, badge, active }: MenuItemProps) {
    return (
        <Link href={href} className="block">
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition ${active ? "bg-brand-primary2 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                <div className="flex items-center gap-3">
                    <Icon icon={icon} className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                </div>

                {badge && (
                    <span className="text-xs bg-brand-primary2 text-white px-2 py-0.5 rounded-full">
                        {badge}
                    </span>
                )}
            </div>
        </Link>
    );
}
