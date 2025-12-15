const categories = ["Shoes", "Brush", "Bag", "T-Shirt"];

export default function Categories() {
    return (
        <section className="px-6 mt-10">
            <h3 className="text-xl mb-4">Browse by categories</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((c) => (
                    <div
                        key={c}
                        className="rounded-2xl overflow-hidden relative"
                    >
                        <img src={`/cat-${c}.jpg`} className="w-full h-40 object-cover" />
                        <span className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full text-xs">
                            {c}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
