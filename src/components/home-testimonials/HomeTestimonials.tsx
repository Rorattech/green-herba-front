import { Star } from 'lucide-react';
import { TestimonialCard } from '../testimonial-card/TestimonialCard';

export default function HomeTestimonials() {
    const testimonials = [
        { name: "Larissa Souza", quote: "Faz parte da minha vida", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600" },
        { name: "Roberto Araújo", quote: "Estou muito melhor", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600" },
        { name: "Sofia Lima", quote: "Acabou com as minhas dores", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600" },
    ];

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4 md:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">

                    <div className="flex flex-col gap-6 sticky top-20">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1 text-[#f59e0b]">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                <span className="text-body-xs text-green-700 font-bold ml-2">1M+ Pessoas Satisfeitas</span>
                            </div>
                            <h2 className="font-heading text-heading-hg text-green-700 leading-heading">
                                Green Herba Pharma
                            </h2>
                            <p className="text-body-sm text-gray-400 max-w-70">
                                Pessoas reais compartilham o impacto da Green Herba Pharma em suas vidas.
                            </p>
                        </div>

                        <button className="w-fit bg-green-700 text-white px-8 py-3 rounded-full text-body-sm font-bold hover:bg-green-400 transition-all shadow-md">
                            Comprar produtos
                        </button>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={i} {...t} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}