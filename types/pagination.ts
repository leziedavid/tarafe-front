import { Reglage } from "./interfaces"

export interface Pagination<T> {
    status: boolean
    total: number
    last_page: number
    page: number
    limit: number
    data: T[]
    reglages?: Reglage[]
}
