'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icon } from "@iconify/react";
import { Orders, OrderStatus } from '@/types/interfaces';
import { updateStatus } from '@/service/orders';
import { Select2 } from '../form/Select2';
import Image from 'next/image';
import { getImagesUrl } from "@/types/baseUrl";




type OrderDetailsProps = {
    order: Orders;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
    readonly?: boolean;
};

export default function OrderDetailsModal({ order, isOpen, onClose, fetchData, readonly = false }: OrderDetailsProps) {

    const urlImages = getImagesUrl();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>(order.status);

    const statusOptions = [
        { label: 'En attente (PENDING)', value: OrderStatus.PENDING },
        { label: 'VALIDE (VALIDED)', value: OrderStatus.VALIDED },
        { label: 'Payé (PAID)', value: OrderStatus.PAID },
        { label: 'Livré (DELIVERED)', value: OrderStatus.DELIVERED },
        { label: 'Terminé (COMPLETED)', value: OrderStatus.COMPLETED },
        { label: 'Annulé (CANCELLED)', value: OrderStatus.CANCELLED },
    ];

    const handleUpdateStatus = async () => {
        setIsSubmitting(true);
        try {
            const res = await updateStatus(order.id, selectedStatus);
            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success("Statut mis à jour avec succès");
                fetchData();
                onClose();
            } else {
                toast.error(res.message || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            toast.error("Erreur serveur lors de la mise à jour");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Icon icon="solar:cart-large-2-bold-duotone" className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Détails de la Commande</h2>
                        <p className="text-sm text-muted-foreground"># {order.id} • {new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${order.status === OrderStatus.COMPLETED ? "bg-green-100 text-green-700" :
                    order.status === OrderStatus.CANCELLED ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                    {order.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Info */}
                <div className="space-y-6">
                    {/* User Info */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Icon icon="solar:user-bold" className="w-4 h-4" />
                            Client
                        </h3>
                        <div className="space-y-1">
                            <p className="font-bold text-gray-900">{order.user?.name || "Client Inconnu"}</p>
                            <p className="text-sm text-gray-600">{order.user?.email}</p>
                            <p className="text-sm text-gray-600 font-medium">{order.user?.contact || "Pas de contact"}</p>
                        </div>
                    </div>

                    {/* Store Info */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Icon icon="solar:shop-bold" className="w-4 h-4" />
                            Boutique
                        </h3>
                        <div className="flex items-center gap-3">
                            {order.store?.logo && (
                                <Image src={`${urlImages}/${order.store.logo}`} alt={order.store.name} width={40} height={40} className="rounded-xl object-cover" unoptimized />
                            )}
                            <div>
                                <p className="font-bold text-gray-900">{order.store?.name}</p>
                                <p className="text-xs text-gray-500">{order.store?.slug}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    {(order.Mode_paiement || order.adresse_paiement || order.notes_orders) && (
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Icon icon="solar:delivery-bold" className="w-4 h-4" />
                                Livraison & Paiement
                            </h3>
                            <div className="space-y-3">
                                {order.Mode_paiement && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 font-medium">Mode de paiement:</span>
                                        <span className="text-xs font-bold text-gray-900">{order.Mode_paiement}</span>
                                    </div>
                                )}
                                {order.adresse_paiement && (
                                    <div className="space-y-1">
                                        <span className="text-xs text-gray-500 font-medium font-bold italic">Adresse de livraison:</span>
                                        <p className="text-xs font-bold text-gray-900">{order.adresse_paiement}</p>
                                    </div>
                                )}
                                {order.notes_orders && (
                                    <div className="space-y-1">
                                        <span className="text-xs text-gray-500 font-medium italic font-bold">Notes sur la commande:</span>
                                        <p className="text-xs text-gray-900 leading-relaxed">{order.notes_orders}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Status Management - Uniquement pour l'admin */}
                    {!readonly && (
                        <div className="p-4 rounded-2xl border-2 border-brand-primary/10 bg-brand-primary/5">
                            <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Icon icon="solar:settings-bold" className="w-4 h-4" />
                                Gérer le statut
                            </h3>
                            <div className="space-y-4">
                                <Select2
                                    options={statusOptions}
                                    selectedItem={selectedStatus}
                                    onSelectionChange={(val) => setSelectedStatus(val as string)}
                                    labelExtractor={(item) => item.label}
                                    valueExtractor={(item) => item.value}
                                    placeholder="Changer le statut"
                                    mode="single"
                                />
                                <Button
                                    onClick={handleUpdateStatus}
                                    disabled={isSubmitting || selectedStatus === order.status}
                                    className="w-full bg-brand-primary text-white font-bold rounded-xl h-12"
                                >
                                    {isSubmitting ? "Mise à jour..." : "Mettre à jour le statut"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Products */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2 flex items-center gap-2">
                        <Icon icon="solar:box-bold" className="w-4 h-4" />
                        Articles ({order.items?.length || 0})
                    </h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-2xl border border-gray-100 hover:border-brand-primary/20 transition-colors">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                    {item.product?.image ? (
                                        <Image src={`${urlImages}/${item.product.image}`} alt={item.product.name} width={64} height={64} className="object-cover w-full h-full" unoptimized />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Icon icon="solar:gallery-bold" width={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <p className="font-bold text-sm text-gray-900 truncate">{item.product?.name}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <p className="text-xs text-gray-500 font-medium">Qté: <span className="text-gray-900 font-bold">{item.quantity}</span></p>
                                        <p className="text-xs text-gray-500 font-medium">Prix unit: <span className="text-gray-900 font-bold">{Number(item.price).toLocaleString()} FCFA</span></p>
                                    </div>
                                    {(item.color || item.size) && (
                                        <div className="flex gap-2 mt-2">
                                            {item.color && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">{item.color}</span>}
                                            {item.size && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">{item.size}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right py-1">
                                    <p className="font-black text-sm text-brand-primary">
                                        {(Number(item.price) * item.quantity).toLocaleString()} FCFA
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t mt-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-lg font-bold text-gray-900">Total Commande</span>
                            <span className="text-2xl font-black text-brand-primary">{Number(order.total).toLocaleString()} FCFA</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Button variant="ghost" onClick={onClose} className="font-bold text-gray-500 hover:text-gray-900">
                    Fermer
                </Button>
            </div>
        </div>
    );
}
