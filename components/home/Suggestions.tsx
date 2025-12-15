export default function Suggestions() {
    return (
        <section className="px-6 mt-16 mb-20">
            <h3 className="text-2xl text-center mb-6">
                You might also like
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <img
                        key={i}
                        src={`/suggest-${i}.jpg`}
                        className="rounded-2xl object-cover h-64 w-full"
                    />
                ))}
            </div>
        </section>
    );
}
