"use client";

import Link from "next/link";
import { Heart, Zap, User, Star } from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function Header() {
  const { lives, xp, level } = useGame();

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b-2 border-gray-border px-4 py-3 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
           <span className="text-3xl group-hover:animate-bounce">🦊</span>
           <span className="text-2xl font-black text-primary tracking-tight hidden sm:block">
             QuizPop
           </span>
        </Link>

        {/* Statystyki */}
        <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Level i XP */}
            <div className="hidden sm:flex items-center gap-2 font-bold text-gray-400">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <span className="text-gray-600">Lvl {level}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                  {xp} XP
                </span>
            </div>

            {/* Życia */}
            <div className={`
              flex items-center gap-2 font-bold px-3 py-1 rounded-full border transition-colors
              ${lives > 1 ? "text-error bg-red-50 border-red-100" : "text-gray-500 bg-gray-100 border-gray-200"}
            `}>
                <Heart className={`w-5 h-5 ${lives > 0 ? "fill-error text-error" : "text-gray-400"}`} />
                <span>{lives}</span>
            </div>

            {/* Profil */}
            <div className="w-10 h-10 bg-primary-light rounded-xl border-2 border-primary flex items-center justify-center text-primary-dark font-bold">
                <User size={20} />
            </div>
        </div>

      </div>
    </header>
  );
}