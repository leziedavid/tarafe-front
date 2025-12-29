import { CategoryProduct, Product, SubCategoryProduct } from "@/types/interfaces";

export const fakeCategories: CategoryProduct[] = [
    {
        id: 1,
        name: "Électronique",
        slug: "electronique",
        added_by: 21,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: "2025-01-01T10:00:00Z",
    },
    {
        id: 2,
        name: "Mode",
        slug: "mode",
        added_by: 21,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: "2025-01-01T10:00:00Z",
    },
    {
        id: 3,
        name: "Maison",
        slug: "maison",
        added_by: 21,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: "2025-01-01T10:00:00Z",
    },
];

export const fakeSubCategories: SubCategoryProduct[] = [
    {
        id: 1,
        name: "Téléphones",
        slug: "telephones",
        category_id: 1,
        added_by: 21,
        created_at: "2025-01-02T10:00:00Z",
        updated_at: "2025-01-02T10:00:00Z",
    },
    {
        id: 2,
        name: "Ordinateurs",
        slug: "ordinateurs",
        category_id: 1,
        added_by: 21,
        created_at: "2025-01-02T10:00:00Z",
        updated_at: "2025-01-02T10:00:00Z",
    },
    {
        id: 3,
        name: "Chaussures",
        slug: "chaussures",
        category_id: 2,
        added_by: 21,
        created_at: "2025-01-02T10:00:00Z",
        updated_at: "2025-01-02T10:00:00Z",
    },
];

export const fakeProducts: Product[] = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        sku: "IPH15PM-001",
        description: "Smartphone haut de gamme avec écran Super Retina XDR",

        image: "uploads/products/iphone.jpg",
        images: [
            {
                id: 1,
                product_id: 1,
                path: "uploads/products/iphone.jpg",
                is_main: 1,
                created_at: "2025-01-10T10:00:00Z",
                updated_at: "2025-01-10T10:00:00Z",
            },
        ],

        price: "1299.00",
        old_price: "1399.00",

        stock: 45,
        available: 1,
        featured: 1,

        tag: "NEW ARRIVAL",
        rating: "4.8",
        review_count: 1245,

        category_id: 1,
        sub_category_id: 1,
        store_id: 7,
        added_by: 21,

        colors: [],

        category: fakeCategories[0],
        sub_category: fakeSubCategories[0],

        store: {
            id: 7,
            name: "Tarafé",
            slug: "boutique-tarafe",
            logo: "uploads/stores/logo.png",
            description: "Boutique officielle Tarafé",
            active: 1,
            added_by: 21,
            created_at: "2025-01-01T08:00:00Z",
            updated_at: "2025-01-01T08:00:00Z",
        },

        created_at: "2025-01-10T10:00:00Z",
        updated_at: "2025-01-10T10:00:00Z",
    },

    {
        id: 2,
        name: "Sneakers Running Pro",
        slug: "sneakers-running-pro",
        sku: "SNK-RUN-002",
        description: "Chaussures de running avec amorti amélioré",

        image: "uploads/products/sneakers.jpg",
        images: [
            {
                id: 2,
                product_id: 2,
                path: "uploads/products/sneakers.jpg",
                is_main: 1,
                created_at: "2025-01-12T10:00:00Z",
                updated_at: "2025-01-12T10:00:00Z",
            },
        ],

        price: "89.99",
        old_price: "119.99",

        stock: 23,
        available: 1,
        featured: 1,

        tag: "GET OFF 20%",
        rating: "4.5",
        review_count: 890,

        category_id: 2,
        sub_category_id: 3,
        store_id: 7,
        added_by: 21,

        colors: [],

        category: fakeCategories[1],
        sub_category: fakeSubCategories[2],

        store: {
            id: 7,
            name: "Tarafé",
            slug: "boutique-tarafe",
            logo: "uploads/stores/logo.png",
            description: "Boutique officielle Tarafé",
            active: 1,
            added_by: 21,
            created_at: "2025-01-01T08:00:00Z",
            updated_at: "2025-01-01T08:00:00Z",
        },

        created_at: "2025-01-12T10:00:00Z",
        updated_at: "2025-01-12T10:00:00Z",
    },

    {
        id: 3,
        name: "Canapé Chesterfield",
        slug: "canape-chesterfield",
        sku: "CSF-CHS-003",
        description: "Canapé en cuir véritable style vintage",

        image: "uploads/products/canape.jpg",
        images: [
            {
                id: 3,
                product_id: 3,
                path: "uploads/products/canape.jpg",
                is_main: 1,
                created_at: "2025-01-13T10:00:00Z",
                updated_at: "2025-01-13T10:00:00Z",
            },
        ],

        price: "2499.00",
        old_price: "null",
        stock: 8,
        available: 1,
        featured: 0,

        tag: "BEST SELLER",
        rating: "4.9",
        review_count: 234,

        category_id: 3,
        sub_category_id: 5,
        store_id: 7,
        added_by: 21,

        colors: [],

        category: fakeCategories[2],
        sub_category: fakeSubCategories[3],

        store: {
            id: 7,
            name: "Tarafé",
            slug: "boutique-tarafe",
            logo: "uploads/stores/logo.png",
            description: "Boutique officielle Tarafé",
            active: 1,
            added_by: 21,
            created_at: "2025-01-01T08:00:00Z",
            updated_at: "2025-01-01T08:00:00Z",
        },

        created_at: "2025-01-13T10:00:00Z",
        updated_at: "2025-01-13T10:00:00Z",
    },
];
