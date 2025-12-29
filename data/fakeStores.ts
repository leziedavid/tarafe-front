// data/fakeStores.ts
import { Store } from "@/types/interfaces";

export const fakeStores: Store[] = [
    {
        id: 1,
        name: "Tech Paradise",
        slug: "tech-paradise",
        logo: "/ads/images-16834R.png",
        description: "Votre destination ultime pour les gadgets et accessoires technologiques.",
        active: 1,
        added_by: 1,
        created_at: "2025-01-10",
        updated_at: "2025-02-15",
    },
    {
        id: 2,
        name: "Mode & Style",
        slug: "mode-style",
        logo: "https://images.unsplash.com/photo-1580910051077-fb611e98f6c0?w=100&h=100&fit=crop",
        description: "Vous recherchez des modes de vie, des styles, des accessoires pour votre mode de vie.",
        active: 1,
        added_by: 2,
        created_at: "2025-02-01",
        updated_at: "2025-03-05",
    },
    {
        id: 3,
        name: "Maison Chic",
        slug: "maison-chic",
        logo: "https://images.unsplash.com/photo-1580910051077-fb611e98f6c0?w=100&h=100&fit=crop",
        description: "Tout pour décorer et embellir votre maison avec style et élégance.",
        active: 1,
        added_by: 3,
        created_at: "2025-01-20",
        updated_at: "2025-03-01",
    },
    {
        id: 4,
        name: "Sportif Pro",
        slug: "sportif-pro",
        logo: "https://images.unsplash.com/photo-1594737625785-1d7e9c5e91b6?w=100&h=100&fit=crop",
        description: "Équipement et accessoires pour les passionnés de sport et de fitness.",
        active: 1,
        added_by: 1,
        created_at: "2025-01-25",
        updated_at: "2025-02-28",
    },
];
