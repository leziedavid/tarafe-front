export default function OfferBanner() {
    return (
        <section className="px-6 mt-14">
            <div className="rounded-3xl overflow-hidden relative">
                <img src="/offer.jpg" className="w-full h-56 object-cover" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-xs mb-2">Offers</span>
                    <h3 className="text-2xl text-center">
                        Exclusive fashion offers await for your
                    </h3>
                    <button className="mt-4 bg-white text-black px-5 py-2 rounded-full text-sm">
                        Check it now
                    </button>
                </div>
            </div>
        </section>
    );
}
