"use client";

export default function ProductCardsSection() {
    const products = [
        {
            title: "PERSONNALISATION DE PRODUITS",
            description:
                "Transformez vos idées en réalité avec notre service de personnalisation sur mesure. Broderie, sérigraphie, et bien plus encore.",
            bgColor: "tarafe-blue",
            link: "#",
        },
        {
            title: "SOLUTIONS POUR ENTREPRISES",
            description:
                "Des vêtements professionnels adaptés à vos besoins. Uniformes, goodies, et collections corporate personnalisées.",
            bgColor: "tarafe-peach",
            link: "#",
        },
    ];

    return (
        <section className="w-full bg-tarafe-gray">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
                <div className="grid md:grid-cols-2 gap-8">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className={`bg-${product.bgColor} rounded-tarafe p-12 md:p-16 hover:scale-[1.02] transition-transform duration-300`}
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-6 text-tarafe-black leading-tight">
                                {product.title}
                            </h2>

                            <p className="text-base md:text-lg leading-relaxed mb-8 text-tarafe-black/80">
                                {product.description}
                            </p>

                            <a
                                href={product.link}
                                className="underline font-semibold inline-flex items-center gap-2 text-tarafe-black hover:gap-4 transition-all duration-300"
                            >
                                En savoir plus
                                <span>→</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
