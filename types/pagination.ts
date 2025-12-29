export interface Pagination<T> {
    status: boolean
    total: number
    last_page: number
    page: number
    limit: number
    data: T[]
}
