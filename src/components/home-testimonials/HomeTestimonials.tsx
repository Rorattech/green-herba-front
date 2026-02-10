import { TestimonialCard } from '../testimonial-card/TestimonialCard';
import { SatisfiedCustomers } from '../satisfied-customers/SatisfiedCustomers';
import { Button } from '../ui/Button';

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
                            <SatisfiedCustomers variant="content" />
                            <h2 className="font-heading text-h2 text-green-800 leading-heading">
                                Green Herba Pharma
                            </h2>
                            <p className="text-body-m font-body font-medium text-green-800">
                                Pessoas reais compartilham o impacto da Green Herba Pharma em suas vidas.
                            </p>
                        </div>

                        <Button className="w-fit">Shop all</Button>
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