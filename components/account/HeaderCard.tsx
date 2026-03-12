"use client";

import { Icon } from "@iconify/react";
import { UserData } from "@/app/middleware";
import React from "react";

type TabType = "Commandes" | "Mon compte";

interface HeaderCardProps {
    user: UserData | null;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    handleLogout: () => void;
    children: React.ReactNode;
}

export default function HeaderCard({
    user,
    activeTab,
    setActiveTab,
    handleLogout,
    children,
}: HeaderCardProps) {
    return (
        <div className="max-w-6xl mx-auto px-4 pt-4 md:pt-16 pb-10 md:pb-16 flex-1 md:mt-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block md:col-span-4 lg:col-span-3">
                    <div className="bg-card rounded-3xl shadow-xl border border-border p-6 sticky top-32">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-3xl font-bold text-brand-primary border-4 border-brand-primary/20">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <h2 className="mt-4 font-bold text-xl">{user?.name || "Utilisateur"}</h2>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab("Commandes")}
                                className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "Commandes"
                                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25"
                                        : "hover:bg-muted text-muted-foreground"
                                    }`}
                            >
                                <Icon icon="solar:cart-large-2-bold-duotone" width={20} />
                                Commandes
                            </button>
                            <button
                                onClick={() => setActiveTab("Mon compte")}
                                className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "Mon compte"
                                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25"
                                        : "hover:bg-muted text-muted-foreground"
                                    }`}
                            >
                                <Icon icon="solar:user-bold-duotone" width={20} />
                                Mon compte
                            </button>
                        </nav>

                        <div className="mt-8 pt-6 border-t border-border">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                            >
                                <Icon icon="solar:logout-bold-duotone" width={20} />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <section className="md:col-span-8 lg:col-span-9">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-brand-primary/10 rounded-2xl">
                            <Icon
                                icon={
                                    activeTab === "Commandes"
                                        ? "solar:cart-large-2-bold-duotone"
                                        : "solar:user-bold-duotone"
                                }
                                className="text-brand-primary w-6 h-6"
                            />
                        </div>
                        <h1 className="text-3xl font-bold">{activeTab}</h1>
                    </div>
                    {children}
                </section>
            </div>
        </div>
    );
}
