"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navbar from "@/components/page/Navbar";
import { useAuthMiddleware, logout, UserData } from "@/app/middleware";
import { getMyAllorders } from "@/service/orders";
import { updateUser } from "@/service/security";
import { Order, OrderStatus } from "@/types/interfaces";
import { Pagination } from "@/types/pagination";
import HeaderCard from "@/components/account/HeaderCard";

type TabType = "Commandes" | "Mon compte";

export default function AccountPage() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("Commandes");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Orders state
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderPagination, setOrderPagination] = useState<Pagination<Order> | null>(null);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [orderPage, setOrderPage] = useState(1);

    // Profile state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const checkAuth = async () => {
            const userData = await useAuthMiddleware();
            if (!userData) {
                // Redirection for security is handled in middleware.ts logout() or checkAuth
                return;
            }
            setUser(userData);
            setProfileName(userData.name || "");
            setProfileEmail(userData.email || "");
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (user && activeTab === "Commandes") {
            fetchOrders();
        }
    }, [user, activeTab, orderPage]);

    const fetchOrders = async () => {
        if (!user) return;
        setIsLoadingOrders(true);
        try {
            const res = await getMyAllorders(user.id, orderPage, 10);
            if (res.statusCode === 200 && res.data) {
                // Compatibility check: res.data might be a Pagination object
                const data = res.data as any;
                if (data.data) {
                    setOrders(data.data);
                    setOrderPagination(data);
                } else {
                    setOrders(data);
                }
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Erreur lors de la récupération des commandes");
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSavingProfile(true);

        try {
            const formData = new FormData();
            formData.append("name", profileName);
            formData.append("email", profileEmail);

            const res = await updateUser(user.id, formData);
            if (res.statusCode === 200) {
                toast.success("Profil mis à jour avec succès");
                setIsEditingProfile(false);
                // Update local user data
                const updatedUser = { ...user, name: profileName, email: profileEmail };
                setUser(updatedUser);
                // Persistent storage update would normally be handled by the service/middleware
            } else {
                toast.error(res.message || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            toast.error("Une erreur est survenue");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.NEW: return "bg-blue-100 text-blue-700";
            case OrderStatus.PROCESSING: return "bg-yellow-100 text-yellow-700";
            case OrderStatus.READY: return "bg-purple-100 text-purple-700";
            case OrderStatus.DELIVERED: return "bg-green-100 text-green-700";
            case OrderStatus.CANCELLED: return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (!isMounted) return null;

    return (
        <>

            <main className="min-h-screen bg-background text-foreground pb-24 relative overflow-x-hidden">

                <Navbar />

                <HeaderCard
                    user={user}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    handleLogout={handleLogout}
                >
                    {activeTab === "Commandes" && (
                        <div className="space-y-4">
                            {isLoadingOrders ? (
                                <div className="grid gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-32 bg-muted animate-pulse rounded-3xl" />
                                    ))}
                                </div>
                            ) : orders.length > 0 ? (
                                <>
                                    <div className="grid gap-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="bg-card border border-border p-6 rounded-3xl group hover:border-brand-primary/30 transition-all duration-300">
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Commande #{order.id}</p>
                                                        <h3 className="text-lg font-bold">Total: {order.total?.toLocaleString()} FCFA</h3>
                                                        <p className="text-sm text-muted-foreground">Passée le {new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                        <Button variant="outline" size="sm" className="rounded-xl border-border hover:bg-muted font-bold">
                                                            Détails
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination Simple */}
                                    {orderPagination && orderPagination.last_page > 1 && (
                                        <div className="mt-10 flex items-center justify-center gap-2">
                                            {Array.from({ length: orderPagination.last_page }, (_, i) => i + 1).map(p => (
                                                <button key={p} onClick={() => setOrderPage(p)} className={`w-10 h-10 rounded-xl font-bold transition-all ${orderPage === p ? "bg-brand-primary text-white" : "bg-card border border-border text-muted-foreground hover:border-brand-primary"}`} >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center bg-card rounded-3xl border border-dashed border-border">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
                                        <Icon icon="solar:box-bold-duotone" width={48} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Aucune commande</h3>
                                    <p className="text-muted-foreground max-w-xs">Vous n'avez pas encore passé de commande sur Tarafé.</p>
                                    <Button onClick={() => router.push("/boutique")} className="mt-8 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl px-8 py-6 font-bold" >
                                        Découvrir la boutique
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Mon compte" && (
                        <div className="bg-card border border-border rounded-3xl p-8 max-w-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold italic">Informations personnelles</h2>
                                    <p className="text-sm text-muted-foreground">Gérez vos coordonnées pour vos prochaines commandes.</p>
                                </div>
                                {!isEditingProfile && (
                                    <Button onClick={() => setIsEditingProfile(true)} variant="outline" className="rounded-2xl border-brand-primary text-brand-primary hover:bg-brand-primary/5 font-bold" >
                                        Modifier
                                    </Button>
                                )}
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground ml-1">Nom complet</label>
                                    <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} readOnly={!isEditingProfile} className={`rounded-2xl h-14 bg-background border-border focus:ring-2 focus:ring-brand-primary/20 ${!isEditingProfile && "opacity-70 cursor-not-allowed"}`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground ml-1">Email</label>
                                    <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} readOnly={!isEditingProfile} type="email" className={`rounded-2xl h-14 bg-background border-border focus:ring-2 focus:ring-brand-primary/20 ${!isEditingProfile && "opacity-70 cursor-not-allowed"}`} />
                                </div>

                                {isEditingProfile && (
                                    <div className="flex items-center gap-4 pt-4">
                                        <Button type="submit" disabled={isSavingProfile} className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl h-14 font-bold shadow-lg shadow-brand-primary/25">
                                            {isSavingProfile ? "Enregistrement..." : "Sauvegarder"}
                                        </Button>
                                        <Button type="button" onClick={() => { setIsEditingProfile(false); setProfileName(user?.name || ""); setProfileEmail(user?.email || ""); }} variant="ghost" className="rounded-2xl h-14 font-bold">
                                            Annuler
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                </HeaderCard>

            </main>

            {/* Mobile Bottom Floating Menu (Akwaba style) */}
            <div className="md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild>
                        <button
                            className="fixed bottom-32 left-8 z-[9999] w-16 h-16 rounded-full bg-brand-primary text-white shadow-2xl border-4 border-white flex items-center justify-center pointer-events-auto active:scale-90 transition-all"
                            aria-label="Menu du compte"
                        >
                            <Icon icon="solar:reorder-bold-duotone" width={32} height={32} />
                        </button>
                    </SheetTrigger>

                    <SheetContent side="bottom" className="rounded-t-[3rem] p-8 border-none bg-card/95 backdrop-blur-xl max-h-[85vh] overflow-y-auto z-[10000]">
                        <SheetHeader className="mb-8">
                            <div className="w-16 h-1 w-full bg-muted rounded-full mx-auto mb-6 opacity-50" />
                            <SheetTitle className="text-center text-2xl font-black italic">Mon Compte</SheetTitle>
                            <SheetDescription className="text-center text-muted-foreground">Gérez vos commandes et votre profil</SheetDescription>
                        </SheetHeader>

                        <div className="flex flex-col items-center mb-10">
                            <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-3xl font-bold text-brand-primary border-4 border-brand-primary/20">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <h3 className="mt-4 font-bold text-lg">{user?.name}</h3>
                        </div>

                        <div className="grid gap-4">
                            <button
                                onClick={() => { setActiveTab("Commandes"); setIsMenuOpen(false); }}
                                className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all ${activeTab === "Commandes" ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/30" : "bg-muted/50 text-foreground"}`}
                            >
                                <div className="flex items-center gap-4 font-bold">
                                    <Icon icon="solar:cart-large-2-bold-duotone" width={24} />
                                    Mes Commandes
                                </div>
                                <Icon icon="solar:alt-arrow-right-bold" width={20} />
                            </button>

                            <button
                                onClick={() => { setActiveTab("Mon compte"); setIsMenuOpen(false); }}
                                className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all ${activeTab === "Mon compte" ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/30" : "bg-muted/50 text-foreground"}`}
                            >
                                <div className="flex items-center gap-4 font-bold">
                                    <Icon icon="solar:user-bold-duotone" width={24} />
                                    Mon Profil
                                </div>
                                <Icon icon="solar:alt-arrow-right-bold" width={20} />
                            </button>

                            <div className="h-px bg-border my-2" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-red-500/10 text-red-500 font-bold transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <Icon icon="solar:logout-bold-duotone" width={24} />
                                    Déconnexion
                                </div>
                                <Icon icon="solar:alt-arrow-right-bold" width={20} />
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

        </>
    );
}
