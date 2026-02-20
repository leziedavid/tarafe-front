import { Icon } from "@iconify/react";

export default function Header() {
    return (
        <header className="px-6 py-4 flex items-center justify-between">
            <Icon icon="solar:hamburger-menu-bold" className="w-5 h-5" />

            <h1 className="font-semibold text-lg">Nextgen</h1>

            <nav className="hidden md:flex items-center gap-4 text-sm">
                <span>About</span>
                <span>FAQs</span>
                <Icon icon="solar:shopping-bag-bold" className="w-5 h-5" />
            </nav>
        </header>
    );
}
