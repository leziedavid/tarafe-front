import Image from 'next/image';

const FashionTrends = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                            FASHION TRENDS
                            <br />
                            AND STYLES
                        </h2>
                        <p className="text-xl text-gray-600">
                            Discover a Wide Range of Fashion Options, Including Clothing, Shoes, Accessories, and More
                        </p>
                        <div className="flex space-x-4">
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Shop Now
                            </button>
                            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                Explore More
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <Image
                            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=500&fit=crop"
                            alt="Fashion Trends"
                            width={600}
                            height={500}
                            className="rounded-lg object-cover w-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FashionTrends;