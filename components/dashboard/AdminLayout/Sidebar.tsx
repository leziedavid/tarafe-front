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
NAV CONFIG — icônes uniques par item
====================================================== */
const NAV_SECTIONS: NavSection[] = [
    {
        title: "MENU",
        items: [
            { label: "Dashboard", icon: "solar:widget-5-bold-duotone", href: "/dashboard" },
            { label: "Transactions", icon: "solar:transfer-horizontal-bold-duotone", href: "/dashboard/transactions" },
            { label: "Demandes", icon: "solar:inbox-archive-bold-duotone", href: "/dashboard/demandes", badge: "12+" },
            { label: "Réalisations", icon: "solar:gallery-bold-duotone", href: "/dashboard/realisations" },
            { label: "Boutiques", icon: "solar:shop-bold-duotone", href: "/dashboard/store" },
            { label: "Liste des boutiques", icon: "solar:shop-2-bold-duotone", href: "/dashboard/boutiques" },
            { label: "Management", icon: "solar:pen-new-square-bold-duotone", href: "/dashboard/management" },
            { label: "Configurations", icon: "solar:settings-bold-duotone", href: "/dashboard/configurations" },
            { label: "Catégories", icon: "solar:tag-bold-duotone", href: "/dashboard/category-manager" },
        ],
    },
    {
        title: "GÉNÉRAL",
        items: [
            { label: "Paramètres", icon: "solar:tuning-2-bold-duotone", href: "/dashboard/settings" },
            { label: "Aide", icon: "solar:question-circle-bold-duotone", href: "/help" },
            { label: "Déconnexion", icon: "solar:logout-3-bold-duotone", href: "/" },
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

export default function Sidebar({ mobileMenuOpen, toggleMobileMenu }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* ── Desktop ── */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex-col shadow-sm">
                <SidebarContent pathname={pathname} />
            </aside>

            {/* ── Mobile Overlay ── */}
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={toggleMobileMenu} />

            {/* ── Mobile Drawer (bottom sheet) ── */}
            <aside className={`fixed bottom-0 left-0 w-full bg-white z-40 md:hidden transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? "translate-y-0" : "translate-y-full"} rounded-t-2xl h-[82%] flex flex-col shadow-2xl`}>
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                {/* Close row */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Navigation</span>
                    <button onClick={toggleMobileMenu} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                        <Icon icon="solar:close-square-bold" className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <SidebarContent pathname={pathname} onNavigate={toggleMobileMenu} />
                </div>
            </aside>
        </>
    );
}

/* ======================================================
SIDEBAR CONTENT
====================================================== */
interface SidebarContentProps {
    pathname: string | null;
    onNavigate?: () => void;
}

function SidebarContent({ pathname, onNavigate }: SidebarContentProps) {
    return (
        <div className="flex flex-col h-full">
            {/* ── Logo ── */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-brand-secondary flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:shop-bold" className="text-white w-4 h-4" />
                </div>
                <div>
                    <span className="font-black text-brand-secondary text-base leading-none">Tarafé</span>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Administration</p>
                </div>
            </div>

            {/* ── Nav sections ── */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
                {NAV_SECTIONS.map((section) => (
                    <div key={section.title}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
                            {section.title}
                        </p>
                        <div className="space-y-0.5">
                            {section.items.map((item) => (
                                <MenuItem key={item.label} {...item} active={pathname === item.href} onClick={() => {
                                    if (item.label === "Déconnexion") {
                                        localStorage.clear();
                                        window.location.href = "/";
                                    }
                                    onNavigate?.();
                                }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 text-center">© 2025 Tarafé • v1.0</p>
            </div>
        </div>
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
    onClick?: () => void;
}

function MenuItem({ icon, label, href, badge, active, onClick }: MenuItemProps) {
    return (
        <Link href={href} onClick={onClick} className="block group">
            <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${active ? "bg-brand-secondary text-white shadow-sm shadow-brand-secondary/20" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                <div className="flex items-center gap-3">
                    <Icon icon={icon} className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${active ? "text-white" : "text-gray-400 group-hover:text-brand-secondary"}`} />
                    <span className="text-sm font-medium truncate">{label}</span>
                </div>

                {badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${active ? "bg-white/20 text-white" : "bg-brand-primary/15 text-brand-primary"}`}>
                        {badge}
                    </span>
                )}
            </div>
        </Link>
    );
}
