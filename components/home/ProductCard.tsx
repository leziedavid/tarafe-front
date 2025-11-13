import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div className="group">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        {product.category}
                    </span>
                </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-lg font-bold text-gray-900">{product.price}</p>
        </div>
    );
};

export default ProductCard;