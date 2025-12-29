interface GetAllProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    sub_category_id?: number;
    store_id?: number;
    available?: boolean;
    sortBy?: 'name' | 'price' | 'date' | 'stock';
}

/**
 * Prépare les paramètres pour l'appel API
 */
export const prepareProductParams = (options: {
    currentPage?: number;
    limit?: number;
    searchTerm?: string;
    selectedCategory?: number | null;
    selectedSubCategory?: number | null;
    available?: boolean;
    sortBy?: 'name' | 'price' | 'date' | 'stock';
}): GetAllProductsParams => {
    const params: GetAllProductsParams = {};

    if (options.currentPage) params.page = options.currentPage;
    if (options.limit) params.limit = options.limit;
    if (options.searchTerm) params.search = options.searchTerm.trim();
    if (options.selectedCategory) params.category_id = options.selectedCategory;
    if (options.selectedSubCategory) params.sub_category_id = options.selectedSubCategory;
    if (options.available !== undefined) params.available = options.available;
    if (options.sortBy) params.sortBy = options.sortBy;

    return params;
};
