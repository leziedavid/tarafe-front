const HeroSection = () => {
    return (
        <section className="relative bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-6">
                    {/* Main Title */}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-light text-gray-900 tracking-wide">
                            IMPROVE YOUR STYLE
                        </h1>
                        <h1 className="text-4xl font-light text-gray-900 tracking-wide">
                            WITH OUR PREMIUM
                        </h1>
                        <h1 className="text-5xl font-bold text-gray-900 tracking-wide">
                            COLLECTION
                        </h1>
                    </div>

                    {/* Tags */}
                    <div className="flex justify-center space-x-6 py-4">
                        <span className="bg-gray-100 px-6 py-2 rounded-full font-medium text-gray-700 text-sm">T-SHIRT</span>
                        <span className="bg-gray-100 px-6 py-2 rounded-full font-medium text-gray-700 text-sm">WOMAN</span>
                        <span className="bg-gray-100 px-6 py-2 rounded-full font-medium text-gray-700 text-sm">CHANEL</span>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Stay Ahead of the Fashion Game with Our Comprehensive Trend<br />
                        Reports, Covering Everything from Runway to Street Style
                    </p>

                    {/* Brand Logos */}
                    <div className="flex justify-center items-center space-x-12 py-8">
                        <span className="text-2xl font-bold text-gray-400">SONY</span>
                        <span className="text-2xl font-bold text-gray-400">CHANEL</span>
                        <span className="text-2xl font-bold text-gray-400">SONY</span>
                        <span className="text-2xl font-bold text-gray-400">SONY</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;