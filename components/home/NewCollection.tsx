import { Product } from '@/types';
import ProductCard from './ProductCard';

const NewCollection = () => {
    const categories = ["ALL", "WOMEN'S", "MAN'S", "T-SHIRT", "SUITS", "CREWNECK", "JACKET", "HOODIE"];

    const products: Product[] = [
        {
            id: 1,
            name: "NAME DUMMY",
            price: "$145.00",
            category: "T-SHIRT",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
        },
        {
            id: 2,
            name: "NAME DUMMY",
            price: "$145.00",
            category: "T-SHIRT",
            image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop"
        },
        {
            id: 3,
            name: "NAME DUMMY",
            price: "$145.00",
            category: "T-SHIRT",
            image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">NEW COUPLE COLLECTION</h2>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewCollection;