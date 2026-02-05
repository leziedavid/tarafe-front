import React from "react";
import { cn } from "@/lib/utils";

interface CardContainerProps {
    children: React.ReactNode;
    bgColor?: string;
    rounded?: "xl" | "2xl" | "3xl" | "card-lg" | "tarafe";
    padding?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

export default function CardContainer({
    children,
    bgColor = "white",
    rounded = "tarafe",
    padding = "xl",
    className,
}: CardContainerProps) {
    const paddingClasses = {
        sm: "p-6",
        md: "p-8 md:p-12",
        lg: "p-12 md:p-16",
        xl: "p-12 md:p-20",
    };

    return (
        <div className={cn(`bg-${bgColor}`, `rounded-${rounded}`, paddingClasses[padding], className)} >
            {children}
        </div>
    );
}
