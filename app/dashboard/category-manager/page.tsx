"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";

import { cn } from "@/lib/utils";
import CategoryManager from "@/components/dashboard/products/CategoryManager";
import SubCategoryManager from "@/components/dashboard/products/SubCategoryManager";

type Tab = "categories" | "subcategories";

export default function Page() {
    const [activeTab, setActiveTab] = useState<Tab>("categories");

    return (
        <AdminLayout>
            {/* Tabs */}
            <div className="flex gap-2 border-b mb-6">
                <button
                    onClick={() => setActiveTab("categories")}
                    className={cn(
                        "px-4 py-2 font-medium",
                        activeTab === "categories"
                            ? "border-b-2 border-brand-primary text-brand-primary"
                            : "text-gray-500"
                    )}
                >
                    Catégories
                </button>

                <button
                    onClick={() => setActiveTab("subcategories")}
                    className={cn(
                        "px-4 py-2 font-medium",
                        activeTab === "subcategories"
                            ? "border-b-2 border-brand-primary text-brand-primary"
                            : "text-gray-500"
                    )}
                >
                    Sous-catégories
                </button>
            </div>

            {/* Content */}
            {activeTab === "categories" && <CategoryManager />}
            {activeTab === "subcategories" && <SubCategoryManager />}
        </AdminLayout>
    );
}
