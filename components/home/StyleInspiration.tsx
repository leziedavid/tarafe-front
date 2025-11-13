import Image from 'next/image';

const StyleInspiration = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <Image
                            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=500&fit=crop"
                            alt="Style Inspiration"
                            width={600}
                            height={500}
                            className="rounded-lg object-cover w-full"
                        />
                    </div>
                    <div className="space-y-6 order-1 lg:order-2">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                            STYLE AND FASHION
                            <br />
                            INSPIRATION
                        </h2>
                        <p className="text-xl text-gray-600">
                            Explore the Latest Styles from Top Designers and Brands, Handpicked by Our Fashion Experts
                        </p>
                        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                            See More Collections
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StyleInspiration;