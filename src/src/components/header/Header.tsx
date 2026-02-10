import { ArrowRight, Search, ShoppingBag, User } from "lucide-react";

export const Header = () => (
    <header className="w-full border-b border-gray-300">
        <div className="flex flex-row items-center justify-center gap-2 p-2 bg-green-700">
            <h3 className="text-green-100 text-body-m font-body font-medium">Lorem Ipsum</h3>
            <ArrowRight size={16} strokeWidth={1.5} color="white" />
        </div>
        <div className="bg-gray-100 flex items-center justify-center">
            <div className="container flex items-center justify-between py-6">
                <div className="flex-1">
                    <h2 className="text-h4 font-heading text-green-800">Green Herba Pharma</h2>
                </div>

                <nav className="flex items-center gap-4">
                    <a href="#" className="text-body-m font-body font-medium text-gray-800 hover:text-green-700 transition-colors">
                        Produtos
                    </a>
                    <a href="#" className="text-body-m font-body font-medium text-gray-800 hover:text-green-700 transition-colors">
                        Sobre
                    </a>
                </nav>

                <div className="flex items-center justify-end gap-6 flex-1 text-gray-700">
                    <button className="hover:text-green-700 transition-colors cursor-pointer">
                        <Search size={22} strokeWidth={1.5} />
                    </button>
                    <button className="hover:text-green-700 transition-colors cursor-pointer">
                        <User size={22} strokeWidth={1.5} />
                    </button>
                    <button className="hover:text-green-700 transition-colors cursor-pointer">
                        <ShoppingBag size={22} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    </header>
)