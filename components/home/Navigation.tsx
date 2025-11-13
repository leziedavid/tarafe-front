import { Search } from 'lucide-react';

const Navigation = () => {
    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-gray-900">SHOPPY</div>

                    {/* Navigation Links - Centered */}
                    <div className="flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
                        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Home</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Shop</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Product</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Career</a>
                    </div>

                    {/* Search */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Product"
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 w-48"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;