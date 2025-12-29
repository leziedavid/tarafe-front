
import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import {MyOrder } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";

export const getAllorders =  async (page: number, limit: number): Promise<BaseResponse<PaginationType<MyOrder>>> => {

    const response = await fetch(`${getBaseUrl()}/orders/admin?page=${page}`, {
        method: "GET",
        headers: { "Content-Type": "application/json",},
    });
    return await response.json();
};

