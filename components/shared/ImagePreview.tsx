"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import NextImage from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getImagesUrl } from "@/types/baseUrl";
import { Icon } from "@iconify/react";

interface ImagePreviewProps<T> {
    data: T[];
    imageKey: keyof T;
    className?: string;
    aspectRatio?: "square" | "video" | "portrait" | "auto";
    objectFit?: "cover" | "contain";
    onClose?: () => void;
    initialIndex?: number | null;
}

export default function ImagePreview<T>({
    data,
    imageKey,
    className,
    aspectRatio = "square",
    objectFit = "cover",
    onClose,
    initialIndex = null,
}: ImagePreviewProps<T>) {
    const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(initialIndex);
    const [mounted, setMounted] = useState(false);
    const urlImages = getImagesUrl();

    useEffect(() => {
        setMounted(true);
        if (data) {
            setLoadingStates(new Array(data.length).fill(true));
        }
    }, [data]);

    useEffect(() => {
        if (initialIndex !== null) {
            setFocusedIndex(initialIndex);
        }
    }, [initialIndex]);

    const handleClose = () => {
        setFocusedIndex(null);
        if (onClose) onClose();
    };

    const handleImageLoad = (index: number) => {
        setLoadingStates((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (focusedIndex !== null) {
            setFocusedIndex((focusedIndex + 1) % data.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (focusedIndex !== null) {
            setFocusedIndex((focusedIndex - 1 + data.length) % data.length);
        }
    };

    const getAspectClass = () => {
        switch (aspectRatio) {
            case "video": return "aspect-video";
            case "portrait": return "aspect-[3/4]";
            case "square": return "aspect-square";
            default: return "";
        }
    };

    if (!data || data.length === 0) return null;

    const isSingle = data.length === 1;

    // Overlay component for Focused View using React Portal
    const FocusedOverlay = () => {
        if (focusedIndex === null || !mounted) return null;

        const item = data[focusedIndex];
        const imagePath = item[imageKey] as unknown as string;

        return createPortal(
            <div
                className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
                onClick={handleClose}
            >
                {/* Close Button */}
                <button
                    className="absolute top-6 right-6 z-[100001] bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all group border border-white/10"
                    onClick={(e) => { e.stopPropagation(); handleClose(); }}
                >
                    <Icon icon="solar:close-circle-bold" className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* Navigation Buttons */}
                {data.length > 1 && (
                    <>
                        <button
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[100001] bg-black/40 hover:bg-black/60 p-4 rounded-full transition-all hover:scale-110 border border-white/5"
                            onClick={prevImage}
                        >
                            <Icon icon="solar:alt-arrow-left-bold" className="w-8 h-8 text-white" />
                        </button>
                        <button
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100001] bg-black/40 hover:bg-black/60 p-4 rounded-full transition-all hover:scale-110 border border-white/5"
                            onClick={nextImage}
                        >
                            <Icon icon="solar:alt-arrow-right-bold" className="w-8 h-8 text-white" />
                        </button>
                    </>
                )}

                {/* Main Focused Image */}
                <div className="relative w-[95vw] h-[85vh] animate-in zoom-in-95 duration-500 overflow-hidden pointer-events-none">
                    <NextImage
                        src={`${urlImages}/${imagePath}`}
                        alt="Focused View"
                        fill
                        className="object-contain p-4"
                        unoptimized
                    />
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 px-6 py-2 rounded-full backdrop-blur-md text-white text-sm font-bold border border-white/10 shadow-lg tracking-widest">
                    {focusedIndex + 1} / {data.length}
                </div>
            </div>,
            document.body
        );
    };

    // If initialIndex is provided, we don't render the grid, only the overlay
    if (initialIndex !== null) {
        return <FocusedOverlay />;
    }

    return (
        <div className="relative w-full">
            <div className={cn("w-full", isSingle ? "max-w-4xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6", className)}>
                {data.map((item, index) => {
                    const imagePath = item[imageKey] as unknown as string;
                    if (!imagePath) return null;

                    return (
                        <div
                            key={index}
                            className={cn(
                                "relative overflow-hidden rounded-2xl group transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl bg-gray-100 dark:bg-gray-800",
                                getAspectClass()
                            )}
                            onClick={() => setFocusedIndex(index)}
                        >
                            {loadingStates[index] && (
                                <Skeleton className="absolute inset-0 z-10 rounded-2xl" />
                            )}

                            <NextImage
                                src={`${urlImages}/${imagePath}`}
                                alt={`Preview ${index + 1}`}
                                fill
                                className={cn(
                                    "transition-all duration-700",
                                    objectFit === "cover" ? "object-cover group-hover:scale-110" : "object-contain",
                                    loadingStates[index] ? "opacity-0" : "opacity-100"
                                )}
                                onLoadingComplete={() => handleImageLoad(index)}
                                unoptimized
                            />

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-all bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-xl">
                                    <Icon icon="solar:magnifer-zoom-in-bold" className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <FocusedOverlay />
        </div>
    );
}

