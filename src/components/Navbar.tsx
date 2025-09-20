import Link from "next/link";
import { Brain } from "lucide-react";

interface NavbarProps {
    rightContent?: React.ReactNode;
}

export default function Navbar({ rightContent }: NavbarProps) {
    return (
        <header className="container mx-auto px-4 py-6">
            <nav className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Brain className="h-8 w-8 text-orange-600" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">HTP Analyzer</span>
                </Link>
                {rightContent && (
                    <div className="flex items-center space-x-4">
                        {rightContent}
                    </div>
                )}
            </nav>
        </header>
    );
}