"use client";

import React, { useMemo } from "react";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import { TrendingUp, Users, ShoppingBag, DollarSign, MoreVertical, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { MyOrder, Role, UserStatus } from "@/types/interfaces";

// --- MOCK DATA ---

const MOCK_REVENUE_DATA = [
    { name: "Jan", total: 2400 },
    { name: "Feb", total: 1398 },
    { name: "Mar", total: 9800 },
    { name: "Apr", total: 3908 },
    { name: "May", total: 4800 },
    { name: "Jun", total: 3800 },
    { name: "Jul", total: 4300 },
];

const MOCK_VISIT_DATA = [
    { name: "Direct", value: 4000 },
    { name: "Facebook", value: 3000 },
    { name: "Instagram", value: 2000 },
    { name: "Twitter", value: 2780 },
    { name: "YouTube", value: 1890 },
];

const MOCK_ORDER_STATUS = [
    { name: "Livré", value: 45, color: "#10b981" },
    { name: "En cours", value: 25, color: "#f59e0b" },
    { name: "Nouveau", value: 20, color: "#3b82f6" },
    { name: "Annulé", value: 10, color: "#ef4444" },
];

const MOCK_RECENT_ORDERS: MyOrder[] = [
    {
        id_orders: "1",
        transaction_id: "TRX-98210",
        total: "45000",
        date_orders: "2024-03-07",
        heurs_orders: "10:30:00",
        couleur_orders: "Bleu",
        taille_orders: "XL",
        pointures_orders: null,
        Mode_paiement: "WAVE",
        adresse_paiement: "Plateau, Abidjan",
        contact_paiement: "0707070707",
        email_orders: "client1@example.com",
        nomUsers_orders: "Jean Dupont",
        status_orders: "1",
        storesId_orders: "1",
        user_id: "10",
        notes_orders: "Livraison rapide svp",
        personnalise: "1",
        created_at: "2024-03-07 10:30:00",
        updated_at: null
    },
    {
        id_orders: "2",
        transaction_id: "TRX-98211",
        total: "12000",
        date_orders: "2024-03-07",
        heurs_orders: "11:15:00",
        couleur_orders: "Rose",
        taille_orders: "M",
        pointures_orders: null,
        Mode_paiement: "ORANGE MONEY",
        adresse_paiement: "Cocody, Abidjan",
        contact_paiement: "0505050505",
        email_orders: "client2@example.com",
        nomUsers_orders: "Marie Koné",
        status_orders: "0",
        storesId_orders: "1",
        user_id: "11",
        notes_orders: null,
        personnalise: "0",
        created_at: "2024-03-07 11:15:00",
        updated_at: null
    },
    {
        id_orders: "3",
        transaction_id: "TRX-98212",
        total: "25000",
        date_orders: "2024-03-06",
        heurs_orders: "16:45:00",
        couleur_orders: "Noir",
        taille_orders: "L",
        pointures_orders: null,
        Mode_paiement: "CASH",
        adresse_paiement: "Marcory, Abidjan",
        contact_paiement: "0101010101",
        email_orders: "client3@example.com",
        nomUsers_orders: "Abdoulaye Traoré",
        status_orders: "2",
        storesId_orders: "2",
        user_id: "12",
        notes_orders: "Cadeau d'anniversaire",
        personnalise: "1",
        created_at: "2024-03-06 16:45:00",
        updated_at: null
    }
];

// --- COMPONENTS ---

const StatCard = ({ title, value, icon: IconComponent, trend, color }: any) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <IconComponent className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h4>
        </div>
    </div>
);

export default function DashboardPage() {
    return (
        <AdminLayout>
            <div className="space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Vue d'ensemble</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Bienvenue, voici un résumé de l'activité de votre plateforme aujourd'hui.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 transition-colors">
                            Exporter Rapport
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold bg-brand-primary2 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                            Derniers 30 jours
                        </button>
                    </div>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Revenu Total"
                        value="1,240,000 FCFA"
                        icon={DollarSign}
                        trend={12.5}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Commandes"
                        value="156"
                        icon={ShoppingBag}
                        trend={8.2}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Visiteurs"
                        value="15,420"
                        icon={Users}
                        trend={-2.4}
                        color="bg-orange-500"
                    />
                    <StatCard
                        title="Produits Actifs"
                        value="42"
                        icon={ShoppingBag}
                        trend={4.0}
                        color="bg-green-500"
                    />
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Revenue Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white">Évolution du Chiffre d'Affaires</h3>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#242078" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#242078" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#242078"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Status Pie Chart */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Statut des Commandes</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={MOCK_ORDER_STATUS}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {MOCK_ORDER_STATUS.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Visitor Stats Bar Chart */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Visites par Plateforme</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_VISIT_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                    <Bar dataKey="value" fill="#242078" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white">Commandes Récentes</h3>
                            <button className="text-xs font-bold text-brand-primary2 hover:underline">Voir tout</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-50 dark:border-gray-800">
                                        <th className="pb-3 font-semibold text-gray-400 text-[10px] uppercase">Client</th>
                                        <th className="pb-3 font-semibold text-gray-400 text-[10px] uppercase">Date</th>
                                        <th className="pb-3 font-semibold text-gray-400 text-[10px] uppercase text-right">Montant</th>
                                        <th className="pb-3 font-semibold text-gray-400 text-[10px] uppercase text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {MOCK_RECENT_ORDERS.map((order) => (
                                        <tr key={order.id_orders} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-4">
                                                <div className="font-bold text-gray-900 dark:text-white">{order.nomUsers_orders}</div>
                                                <div className="text-[10px] text-gray-400">{order.transaction_id}</div>
                                            </td>
                                            <td className="py-4 text-gray-500 dark:text-gray-400 text-xs">
                                                {order.date_orders}
                                            </td>
                                            <td className="py-4 text-right font-bold text-gray-900 dark:text-white">
                                                {order.total} FCFA
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.status_orders === "1" ? "bg-green-100 text-green-700" :
                                                    order.status_orders === "0" ? "bg-blue-100 text-blue-700" :
                                                        "bg-orange-100 text-orange-700"
                                                    }`}>
                                                    {order.status_orders === "1" ? "Livré" : order.status_orders === "0" ? "Nouveau" : "En cours"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


