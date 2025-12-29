// data/fakeStores.ts
import { Store } from "@/types/interfaces";

export const fakeStores: Store[] = [
    {
        id: 1,
        name: "Tech Paradise",
        slug: "tech-paradise",
        logo: "/ads/images-16834R.png",
        active: true,
        added_by: 1,
        createdAt: "2025-01-10",
        updatedAt: "2025-02-15",
    },
    {
        id: 2,
        name: "Mode & Style",
        slug: "mode-style",
        logo: "https://images.unsplash.com/photo-1580910051077-fb611e98f6c0?w=100&h=100&fit=crop",
        active: true,
        added_by: 2,
        createdAt: "2025-02-01",
        updatedAt: "2025-03-05",
    },
    {
        id: 3,
        name: "Maison Chic",
        slug: "maison-chic",
        logo: "https://images.unsplash.com/photo-1580910051077-fb611e98f6c0?w=100&h=100&fit=crop",
        active: false,
        added_by: 3,
        createdAt: "2025-01-20",
        updatedAt: "2025-03-01",
    },
    {
        id: 4,
        name: "Sportif Pro",
        slug: "sportif-pro",
        logo: "https://images.unsplash.com/photo-1594737625785-1d7e9c5e91b6?w=100&h=100&fit=crop",
        active: true,
        added_by: 1,
        createdAt: "2025-01-25",
        updatedAt: "2025-02-28",
    },
];
