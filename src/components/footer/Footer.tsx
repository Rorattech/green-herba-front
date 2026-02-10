import { Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer = () => (
    <footer className="bg-green-700 text-white px-8 py-16 font-sans">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                <div className="md:col-span-4 space-y-6">
                    <h2 className="text-3xl font-serif">Terra Health</h2>
                    <p className="text-sm font-light">Join our newsletter and save 10% on your first order</p>

                    <form className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-transparent border border-white/30 rounded-full px-4 py-2 grow focus:outline-none focus:border-white transition-colors"
                        />
                        <button className="bg-gray-200 text-green-700 px-6 py-2 rounded-full font-medium hover:bg-white transition-colors">
                            Subscribe
                        </button>
                    </form>

                    <p className="text-[10px] text-white/60">
                        By subscribing, you agree to our <a href="#" className="underline">Terms of service</a> & <a href="#" className="underline">Privacy policy</a>.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <Instagram size={20} className="cursor-pointer hover:text-white/70" />
                        <Facebook size={20} className="cursor-pointer hover:text-white/70" />
                        <Youtube size={20} className="cursor-pointer hover:text-white/70" />
                    </div>
                </div>

                <div className="md:col-start-7 md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-bold mb-4">Shop</h4>
                        <ul className="space-y-3 text-sm font-light text-white/80">
                            <li className="hover:text-white cursor-pointer transition-colors">Shop all</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Best sellers</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Daily essentials</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Targeted support</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Long-term wellness</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Info</h4>
                        <ul className="space-y-3 text-sm font-light text-white/80">
                            <li className="hover:text-white cursor-pointer transition-colors">Journal</li>
                            <li className="hover:text-white cursor-pointer transition-colors">About</li>
                            <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Login</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm font-light text-white/80">
                            <li className="hover:text-white cursor-pointer transition-colors">Privacy policy</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Terms of service</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Cookies settings</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Shipping policy</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Start a return</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-xs text-white/60">© Terra Health 2026</p>

                <div className="flex gap-2 items-center opacity-80">
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">VISA</div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">MC</div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">AMEX</div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">PAY</div>
                </div>
            </div>
        </div>
    </footer>
);