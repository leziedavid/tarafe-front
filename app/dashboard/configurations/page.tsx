'use client';
import React, { useState } from 'react';
import PubliciteManager from '@/components/form/PubliciteManager';
import { FileText, Settings, Image, Users, Wallet } from 'lucide-react';
import ReglageManager from '@/components/form/ReglageManager';
import AdminLayout from '@/components/dashboard/AdminLayout/AdminLayout';
import EquipeManager from '@/components/form/EquipeManager';


export default function AdminSettingsPage() {

    const [activeTab, setActiveTab] = useState('equipes');

    const tabs = [
        { id: 'equipes', name: 'equipes', icon: Image },
        { id: 'reglages', name: 'Réglages', icon: Settings },
        { id: 'publicites', name: 'Publicités', icon: FileText },
        { id: 'partenaires', name: 'Partenaires', icon: Users },
        { id: 'payment-methodes', name: 'Méthodes de paiement', icon: Wallet },
    ];

    return (
        <AdminLayout>
            <div className="w-full overflow-x-auto">
                <div className="bg-white mb-10">
                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <nav
                                className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 py-4"
                                aria-label="Tabs"
                            >
                                {tabs.map((tab) => {
                                    const IconComponent = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                            flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-sm
                                            transition-all duration-200
                                            ${isActive ? 'bg-[#B07B5E] text-white border border-[#B07B5E]'  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'}  `}
                                        >
                                            <IconComponent className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{tab.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8">
                        {activeTab === 'equipes' && <EquipeManager />}
                        {activeTab === 'reglages' && <ReglageManager />}
                        {activeTab === 'publicites' && <PubliciteManager />}
                    {/*  {activeTab === 'partenaires' && <PartenaireManager />}
                    {activeTab === 'payment-methodes' && <PaymentMethodeManager />} */}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
