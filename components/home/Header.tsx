import { Menu, Search, ShoppingBag } from "lucide-react";

export default function Header() {
    return (
        <header className="px-6 py-4 flex items-center justify-between">
            <Menu />

            <h1 className="font-semibold text-lg">Nextgen</h1>

            <nav className="hidden md:flex items-center gap-4 text-sm">
                <span>About</span>
                <span>FAQs</span>
                <ShoppingBag />
            </nav>
        </header>
    );
}
