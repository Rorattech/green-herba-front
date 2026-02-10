import { CategoryCard } from "../category-card/CategoryCard";

export default function HomeCategories() {
    const categories = [
        { title: "Saúde", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600" },
        { title: "Foco", image: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=600" },
        { title: "Medicamentos", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600" },
    ];

    return (
        <section className="bg-green-700 py-14 px-4 md:px-0">
            <div className="container mx-auto">
                <div className="mb-8">
                    <h2 className="font-heading text-h2 text-green-100 mb-4 leading-heading">
                        Medicamentos para todas as áreas da vida
                    </h2>
                    <p className="text-body-m font-body font-medium text-green-100 leading-body">
                        Categorias focadas em dar suporte ao seu corpo no dia a dia — seja para construir
                        uma base sólida ou atender a uma necessidade específica.
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