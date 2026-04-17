"use client";

import React from "react";
import MyModal from "./MyModal";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface DeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    loading?: boolean;
    confirmText?: string;
    cancelText?: string;
}

/**
 * DeleteModal - A premium reusable confirmation modal for delete actions.
 * Uses MyModal for consistent animations and overlay behavior.
 */
export default function DeleteModal({
    open,
    onClose,
    onConfirm,
    title = "Confirmer la suppression",
    message = "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
    loading = false,
    confirmText = "Supprimer",
    cancelText = "Annuler",
}: DeleteModalProps) {
    return (
        <MyModal open={open} onClose={onClose} typeModal="normal">
            <div className="flex flex-col items-center text-center py-4">
                {/* Warning Icon with pulse effect */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-25 scale-150" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-100/50 text-red-600 border-4 border-red-50">
                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-10 w-10" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:px-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-red-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Icon icon="line-md:loading-twotone-loop" className="h-5 w-5" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </MyModal>
    );
}
