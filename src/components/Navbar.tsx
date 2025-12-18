import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface NavbarProps {
    active: string;
    onChange: (screen: string) => void;
}

export function Navbar({ active, onChange }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: 'home', label: 'Início' },
        { id: 'series', label: 'Séries' },
        { id: 'movies', label: 'Filmes' },
        { id: 'live-tv', label: 'Ao Vivo' },
    ];

    return (
        <nav className={cn(
            "fixed top-0 z-50 w-full px-6 md:px-12 py-4 transition-all duration-500",
            isScrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
        )}>
            <div className="flex items-center gap-4 md:gap-12">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
                    alt="RedFlix"
                    className="h-6 md:h-8 cursor-pointer"
                    onClick={() => onChange('home')}
                />

                <div className="flex gap-3 md:gap-6">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            className={cn(
                                "text-xs md:text-sm font-medium transition-colors hover:text-gray-300 focus-ring px-2 py-1 rounded",
                                active === item.id ? "text-white font-bold" : "text-gray-400"
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-3 md:gap-6">
                    <button 
                        onClick={() => onChange('search')}
                        className="text-white hover:text-gray-300 focus-ring p-1"
                        title="Buscar"
                    >
                        🔍
                    </button>
                    <button 
                        onClick={() => onChange('favorites')}
                        className="text-white hover:text-gray-300 focus-ring p-1"
                        title="Favoritos"
                    >
                        ❤️
                    </button>
                    <button 
                        onClick={() => onChange('history')}
                        className="text-white hover:text-gray-300 focus-ring p-1"
                        title="Histórico"
                    >
                        📜
                    </button>
                    <button 
                        onClick={() => onChange('settings')}
                        className="text-white hover:text-gray-300 focus-ring p-1"
                        title="Configurações"
                    >
                        ⚙️
                    </button>
                    <div 
                        className="h-8 w-8 rounded bg-red-600 focus-ring cursor-pointer flex items-center justify-center text-white font-bold"
                        onClick={() => onChange('profile')}
                        title="Perfil"
                    >
                        👤
                    </div>
                </div>
            </div>
        </nav>
    );
}
