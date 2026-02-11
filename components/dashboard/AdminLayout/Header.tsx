"use client";

import { Search, Bell, Mail, Menu, User, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserInfos, logout } from "@/app/middleware";

interface UserInfo {
    id: number;
    name: string;
    email: string;
    roles: any;
    status: number;
    stores: any[];
}

export default function Header({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
    const router = useRouter();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Charger les informations utilisateur
    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const user = await getUserInfos();
                if (user) {
                    setUserInfo(user);
                } else {
                    // Si pas d'utilisateur, rediriger vers login
                    router.push('/auth/login');
                }
            } catch (error) {
                console.error('Erreur chargement utilisateur:', error);
                toast.error('Erreur de chargement des informations');
            } finally {
                setLoading(false);
            }
        };

        loadUserInfo();
    }, [router]);

    // Fermer le menu en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Gérer la déconnexion
    const handleLogout = () => {  logout(); toast.success('Déconnexion réussie'); };

    // Obtenir les initiales de l'utilisateur
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-30 bg-white px-4 md:px-8 py-4 flex items-center justify-between border-b">
            {/* Mobile Menu Icon */}
            <div className="md:hidden">
                <button
                    onClick={toggleMobileMenu}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-full w-full md:w-[420px] mx-4 md:mx-0">
                {/* Espace pour barre de recherche ou autre */}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">
                {/* Icons visible seulement sur desktop */}
                <div className="hidden md:flex items-center gap-5">
                    <IconButton>
                        <Bell className="w-5 h-5" />
                    </IconButton>
                </div>

                {/* User Section */}
                <div className="relative" ref={userMenuRef}>
                    {/* User button */}
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 rounded-full p-1 md:p-0"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-brand-primary2 flex items-center justify-center text-white font-semibold">
                                {userInfo ? getInitials(userInfo.name) : <User className="w-5 h-5" />}
                            </div>
                        )}

                        {/* Nom et email cachés sur mobile */}
                        <div className="hidden md:block text-sm text-left">
                            {loading ? (
                                <>
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                                </>
                            ) : userInfo ? (
                                <>
                                    <div className="font-medium">{userInfo.name}</div>
                                    <div className="text-gray-400 text-xs">
                                        {userInfo.email}
                                    </div>
                                </>
                            ) : (
                                <div className="font-medium">Utilisateur</div>
                            )}
                        </div>
                    </button>

                    {/* User Menu Popup */}
                    {userMenuOpen && !loading && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-40">
                            {/* Info user sur mobile */}
                            <div className="px-4 py-3 border-b md:hidden">
                                {userInfo ? (
                                    <>
                                        <div className="font-medium">{userInfo.name}</div>
                                        <div className="text-gray-400 text-xs">
                                            {userInfo.email}
                                        </div>
                                        {userInfo.stores && userInfo.stores.length > 0 && (
                                            <div className="text-xs text-brand-primary2 mt-1">
                                                {userInfo.stores.length} magasin(s)
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="font-medium">Utilisateur</div>
                                )}
                            </div>

                            {/* Afficher les stores sur desktop aussi */}
                            {userInfo?.stores && userInfo.stores.length > 0 && (
                                <div className="px-4 py-2 border-b hidden md:block">
                                    <div className="text-xs text-gray-500">Magasins</div>
                                    <div className="text-sm font-medium text-brand-primary2">
                                        {userInfo.stores.length} magasin(s) actif(s)
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    router.push('/dashboard/profile');
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                            >
                                <User className="w-4 h-4" />
                                <span>Mon compte</span>
                            </button>

                            <button 
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    router.push('/dashboard/settings');
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Paramètres</span>
                            </button>

                            <button   onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left text-red-600" >
                                <LogOut className="w-4 h-4" />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function IconButton({ children }: { children: React.ReactNode }) {
    return (
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            {children}
        </button>
    );
}