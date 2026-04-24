
import { BaseResponse } from "@/types/BaseResponse";
import { Orders, OrderState, MyOrder } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { api } from "@/lib/proxy";

// createOrder

export const createOrder = async (order: any): Promise<BaseResponse<Orders>> => {
    return await api.post('/orders', order);
};

// getmyAllorders ${id}

export const getMyAllorders = async (id: number, page: number, limit: number): Promise<BaseResponse<PaginationType<Orders>>> => {
    return await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
};

// getOrderByStore
export const getOrderByStore = async (storeid: number, page: number, limit: number): Promise<BaseResponse<PaginationType<Orders>>> => {
    return await api.get(`/orders/admin?page=${page}`);
};


export const getAllorders = async (page: number, limit: number): Promise<BaseResponse<PaginationType<Orders>>> => {
    return await api.get(`/orders/admin?page=${page}`);
};

// updateStatus

export const updateStatus = async (id: number, statut: string): Promise<BaseResponse<Orders>> => {
    return api.put(`/orders/update/${id}/status`, { status: statut });
}

// statistique sur les commande : 
export const getStats = async (): Promise<BaseResponse<PaginationType<OrderState>>> => {
    return await api.get(`/orders/stats`);
};


