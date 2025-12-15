import { Heart } from "lucide-react";

export default function PopularProducts() {
    return (
        <section className="px-6 mt-12">
            <h3 className="text-xl mb-4">Popular products</h3>

            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i}>
                        <div className="relative rounded-2xl overflow-hidden">
                            <img src={`/product-${i}.jpg`} className="w-full h-72 object-cover" />
                            <Heart className="absolute top-3 right-3 text-white" />
                        </div>

                        <p className="mt-2">Product name</p>
                        <span className="text-sm text-gray-500">$125</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
