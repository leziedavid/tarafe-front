"use client";

export default function FinalCTASection() {
    return (
        <section className="w-full bg-tarafe-gray py-section-lg">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Grand conteneur CTA */}
                <div className="bg-gradient-to-br from-tarafe-lavender to-tarafe-blue rounded-tarafe p-12 md:p-20 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-6 text-tarafe-black leading-tight max-w-3xl mx-auto">
                        PRÊT À TRANSFORMER VOTRE STYLE ?
                    </h2>

                    <p className="text-base md:text-lg lg:text-xl leading-relaxed mb-10 text-tarafe-black/80 max-w-2xl mx-auto">
                        Rejoignez plus de 10 000 professionnels et particuliers qui font confiance à Tarafé pour leurs besoins en mode et personnalisation.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="bg-[#fd980e] text-white px-10 py-2 rounded-full font-bold text-base md:text-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
                            Ouvrir un compte
                        </button>

                        <button className="bg-transparent border-2 border-tarafe-black text-tarafe-black px-10 py-2 rounded-full font-bold text-base md:text-lg hover:bg-tarafe-black hover:text-[#fd980e] transition-all duration-300">
                            Nous contacter
                        </button>
                    </div>

                    <p className="text-sm text-tarafe-black/60 mt-8">
                        ✨ ⚡ Support 24/7 • 🔒 Paiement sécurisé
                    </p>
                </div>
            </div>
        </section>
    );
}
