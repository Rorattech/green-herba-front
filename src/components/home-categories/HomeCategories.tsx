import { CategoryCard } from "../category-card/CategoryCard";

export default function HomeCategories() {
    const categories = [
        { title: "Saúde", image: "https://images.unsplash.com/photo-1604660664082-3cac347079b0?q=100&w=1920" },
        { title: "Equilíbrio", image: "https://images.unsplash.com/photo-1612477954469-c6a60de89802?q=90&w=1920" },
        { title: "Pet", image: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?q=80&w=1920" },
    ];

    return (
        <section className="bg-green-700 py-10 md:py-14 px-4 md:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="mb-8">
                    <h2 className="font-heading text-h3 md:text-h2 text-green-100 mb-4 leading-heading">
                        Saúde e equilíbrio para cada momento da sua vida.
                    </h2>
                    <p className="text-body-m font-body font-medium text-green-100 leading-body">
                        Categorias desenvolvidas para apoiar o equilíbrio do organismo, desde o cuidado contínuo até necessidades específicas.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat, index) => (
                        <CategoryCard key={index} title={cat.title} image={cat.image} />
                    ))}
                </div>
            </div>
        </section>
    );
}