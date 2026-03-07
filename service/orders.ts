
import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { MyOrder } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";



// createOrder

export const createOrder = async (order: any): Promise<BaseResponse<MyOrder>> => {
    const response = await fetch(`${getBaseUrl()}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(order),
    });
    return await response.json();
};

// getmyAllorders``

export const getMyAllorders = async (id: number, page: number, limit: number): Promise<BaseResponse<PaginationType<MyOrder>>> => {
    const response = await fetch(`${getBaseUrl()}/orders/my-orders/${id}?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", },
    });
    return await response.json();
};

export const getAllorders = async (page: number, limit: number): Promise<BaseResponse<PaginationType<MyOrder>>> => {
    const response = await fetch(`${getBaseUrl()}/orders/admin?page=${page}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", },
    });
    return await response.json();
};

