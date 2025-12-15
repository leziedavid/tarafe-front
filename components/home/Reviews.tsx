export default function Reviews() {
    return (
        <section className="px-6 mt-16 text-center">
            <h3 className="text-2xl">
                Over 350+ Customer reviews from our client
            </h3>

            <div className="flex justify-center gap-6 mt-8 flex-wrap">
                {[1, 2, 3, 4, 5].map(i => (
                    <img
                        key={i}
                        src={`/review-${i}.jpg`}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                ))}
            </div>
        </section>
    );
}
