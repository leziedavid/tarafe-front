import React from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
    children: React.ReactNode;
    bgColor?: string;
    className?: string;
}

export default function SectionWrapper({
    children,
    bgColor = "tarafe-gray",
    className,
}: SectionWrapperProps) {
    return (
        <section className={cn(`w-full bg-${bgColor} py-section-lg`, className)}>
            <div className="max-w-[1400px] mx-auto px-6">{children}</div>
        </section>
    );
}
