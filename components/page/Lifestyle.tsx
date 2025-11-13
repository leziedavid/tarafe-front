"use client";

import { ArrowRight } from "lucide-react";

export default function Lifestyle() {
    return (
        <section className="flex items-center justify-between max-w-5xl mx-auto mt-16 px-6 py-10 border-t border-gray-200">
            <div>
                <p className="text-gray-400 text-lg">01</p>
                <h3 className="text-2xl font-semibold mt-2">
                    Set Up Your Fashion With The Latest Trends
                </h3>
                <p className="text-sm text-gray-500 mt-1">Lifestyle</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-800" />
        </section>
    );
}
