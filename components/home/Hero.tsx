import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="px-6">
            <div className="relative rounded-3xl overflow-hidden">
                <img
                    src="/hero.jpg"
                    alt="Hero"
                    className="w-full h-[420px] object-cover"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                    <h2 className="text-4xl font-light">Summer Arrival of Outfit</h2>
                    <p className="mt-3 text-sm max-w-md">
                        Discover quality fashion that reflects your style
                    </p>

                    <button className="mt-6 flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full text-sm">
                        Explore Product <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
