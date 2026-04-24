"use client";

import React, { useState, useEffect, useTransition } from "react";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import { Table } from "@/components/table/tables/table";
import { OrdersColumns } from "@/components/table/columns/tableColumns";
import { getAllorders, getStats } from "@/service/orders";
import { Orders, OrderState, OrderStatus } from "@/types/interfaces";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import MyModal from "@/components/modal/MyModal";
import OrderDetailsModal from "@/components/modal/OrderDetailsModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
    const [isReady, setIsReady] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [stats, setStats] = useState<OrderState | null>(null);
    const [isLoading, startTransition] = useTransition();

    // Modal state
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);

    const fetchData = async () => {
        try {
            const response = await getAllorders(currentPage, limit);
            if (response.statusCode === 200 && response.data) {
                setOrders(response.data.data);
                setTotalItems(response.data.total || 0);
            } else {
                toast.error(response.message || "Erreur lors de la récupération des commandes");
            }
        } catch (error) {
            toast.error("Erreur serveur lors du chargement des commandes");
        } finally {
            setIsReady(true);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getStats();
            if (response.statusCode === 200 && response.data) {
                setStats(response.data as any);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchStats();
    }, [currentPage]);

    const handleViewDetails = (order: Orders) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const refreshData = () => {
        fetchData();
        fetchStats();
    };

    if (!isReady) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-[70vh]">
                    <Icon icon="solar:spinner-bold-duotone" className="w-12 h-12 animate-spin text-brand-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6 mt-4 pb-12">
                {/* Header Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black italic text-gray-900 flex items-center gap-3">
                            <Icon icon="solar:cart-large-2-bold-duotone" className="text-brand-primary" />
                            Gestion des commandes
                        </h1>
                        <p className="text-muted-foreground font-medium">Suivez et gérez les ventes de toutes les boutiques.</p>
                    </div>
                    <Button
                        onClick={refreshData}
                        variant="outline"
                        className="rounded-2xl border-border hover:bg-muted font-bold flex items-center gap-2 h-12 px-6"
                    >
                        <Icon icon="solar:refresh-bold-duotone" width={20} />
                        Actualiser
                    </Button>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4">

                    <div className="bg-brand-secondary text-white rounded-[2rem] p-8 shadow-xl shadow-brand-secondary/20 relative overflow-hidden group">
                        <Icon icon="solar:wallet-money-bold-duotone" className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                        <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-4">Revenu Total</h3>
                        <div className="text-3xl font-black">
                            {stats?.total_revenue?.toLocaleString() || 0} <span className="text-base font-medium opacity-80">FCFA</span>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-gray-50 rounded-[2rem] p-8 hover:border-brand-primary/20 transition-all group">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                            Commandes
                            <Icon icon="solar:box-bold-duotone" className="text-brand-primary w-5 h-5" />
                        </h3>
                        <div className="text-3xl font-black text-gray-900">
                            {stats?.total_orders || 0}
                        </div>
                    </div>

                    <div className="bg-white border-2 border-gray-50 rounded-[2rem] p-8 hover:border-blue-200 transition-all">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                            En attente
                            <Icon icon="solar:clock-circle-bold-duotone" className="text-blue-500 w-5 h-5" />
                        </h3>
                        <div className="text-3xl font-black text-gray-900">
                            {stats?.orders_by_status?.PENDING || 0}
                        </div>
                    </div>

                    <div className="bg-green-700 text-white rounded-[2rem] p-8 shadow-xl shadow-brand-secondary/20 relative overflow-hidden group">
                        <Icon icon="solar:wallet-money-bold-duotone" className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                        <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-4">Validé</h3>
                        <div className="text-3xl font-black">
                            {stats?.orders_by_status?.VALIDED || 0}
                        </div>
                    </div>


                    <div className="bg-white border-2 border-gray-50 rounded-[2rem] p-8 hover:border-green-200 transition-all">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                            Terminées
                            <Icon icon="solar:check-circle-bold-duotone" className="text-green-500 w-5 h-5" />
                        </h3>
                        <div className="text-3xl font-black text-gray-900">
                            {stats?.orders_by_status?.COMPLETED || 0}
                        </div>
                    </div>

                </div>

                {/* Table Section */}
                <div className="px-4">
                    <div className="bg-white border-2 border-gray-50 rounded-sm p-4 shadow-sm overflow-hidden">
                        <Table<Orders>
                            data={orders}
                            columns={OrdersColumns()}
                            getRowId={(order) => order.id}
                            enableMultiple={false}
                            onUpdate={handleViewDetails}
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={limit}
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                        />
                        {orders.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
                                    <Icon icon="solar:box-bold-duotone" width={48} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Aucune commande</h3>
                                <p className="text-muted-foreground">Les commandes apparaîtront ici dès qu'elles seront passées.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Order Details */}
            {isDetailsModalOpen && selectedOrder && (
                <MyModal open={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    mode="mobile"
                    typeModal="large"
                >
                    <OrderDetailsModal
                        order={selectedOrder}
                        isOpen={isDetailsModalOpen}
                        onClose={() => setIsDetailsModalOpen(false)}
                        fetchData={refreshData}
                    />
                </MyModal>
            )}
        </AdminLayout>
    );
}
