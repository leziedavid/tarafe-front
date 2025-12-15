export default function PromoCards() {
    return (
        <section className="px-6 mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-yellow-100 p-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg">Where dreams meet couture</h3>
                    <button className="mt-4 bg-white px-4 py-1 rounded-full text-sm">
                        Shop Now
                    </button>
                </div>
                <img src="/promo1.jpg" className="h-32" />
            </div>

            <div className="rounded-2xl bg-pink-100 p-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg">Enchanting styles for every women</h3>
                    <button className="mt-4 bg-white px-4 py-1 rounded-full text-sm">
                        Shop Now
                    </button>
                </div>
                <img src="/promo2.jpg" className="h-32" />
            </div>
        </section>
    );
}
