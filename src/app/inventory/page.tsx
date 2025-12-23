"use client";

import { useEffect, useState } from "react";
import Button3D from "@/components/Button3D";
import { useGame } from "@/context/GameContext";
import { ArrowLeft, Lock, Award, Shield, Zap, BookOpen, Target, Crown, Star, LucideIcon } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

const iconMap: Record<string, LucideIcon> = {
  Star: Star,
  BookOpen: BookOpen,
  Target: Target,
  Zap: Zap,
  Shield: Shield,
  Crown: Crown,
};

const getBadgeStyle = (name: string) => {
  switch (name) {
    case 'Początkujący': 
      return 'text-yellow-600 bg-yellow-100 border-yellow-200 shadow-yellow-200';
    case 'Pilny Uczeń': 
      return 'text-blue-600 bg-blue-100 border-blue-200 shadow-blue-200';
    case 'Snajper': 
      return 'text-red-600 bg-red-100 border-red-200 shadow-red-200'; 
    case 'Szybki Bill': 
      return 'text-purple-600 bg-purple-100 border-purple-200 shadow-purple-200';
    case 'Niezniszczalny': 
      return 'text-green-600 bg-green-100 border-green-200 shadow-green-200'; 
    case 'Król Kodu': 
      return 'text-amber-700 bg-amber-100 border-amber-400 shadow-amber-300'; 
    case 'Mistrz Next.js': 
      return 'text-white bg-black border-gray-600 shadow-gray-400'; 
      
    default: 
      return 'text-gray-500 bg-gray-100 border-gray-200';
  }
};

type Badge = {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  required_level: number;
  criteria_type: string;
  criteria_value: number;
};

export default function InventoryPage() {
  const { level, lives, xp, gamesPlayed, perfectGames } = useGame();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data } = await supabase.from('badges').select('*').order('required_level', { ascending: true });
      if (data) setBadges(data);
      setLoading(false);
    };
    fetchBadges();
  }, []);

  const isBadgeUnlocked = (badge: Badge) => {
    if (badge.criteria_type === 'games') return gamesPlayed >= badge.criteria_value;
    if (badge.criteria_type === 'perfect') return perfectGames >= badge.criteria_value;
    return level >= badge.criteria_value;
  };

  const unlockedCount = badges.filter(isBadgeUnlocked).length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-block p-4 bg-orange-100 rounded-full text-orange-500 mb-2 animate-bounce-slow shadow-lg shadow-orange-200/50">
            <Award size={40} />
        </div>
        <h1 className="text-4xl font-black text-gray-800">Twój Ekwipunek</h1>
        <p className="text-gray-500 font-bold">Zgromadzone przedmioty i odznaki</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 border-b-[6px] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="text-4xl drop-shadow-sm">❤️</div>
            <div>
                <h3 className="font-black text-xl text-gray-800">Punkty Życia</h3>
                <p className="text-gray-400 font-bold">{lives} / 5 dostępnych</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 border-b-[6px] flex items-center gap-4 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="text-4xl drop-shadow-sm">💎</div>
            <div>
                <h3 className="font-black text-xl text-gray-800">Doświadczenie</h3>
                <p className="text-gray-400 font-bold">{xp} XP (Level {level})</p>
            </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-black text-gray-800">Kolekcja Odznak</h2>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Odblokowano {unlockedCount} / {badges.length}
            </span>
        </div>

        {loading ? (
            <div className="text-center py-10 text-gray-400 font-bold animate-pulse">Ładowanie kolekcji...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map((badge) => {
                    const unlocked = isBadgeUnlocked(badge);
                    const Icon = iconMap[badge.icon_name] || Star;
                    
                    const style = getBadgeStyle(badge.name);

                    return (
                        <div key={badge.id} className={`
                            relative p-4 rounded-2xl border-2 flex items-center gap-4 transition-all
                            ${!unlocked 
                                ? "bg-gray-50 border-gray-100 opacity-60 grayscale" 
                                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-1"}
                        `}>
                            {!unlocked && <div className="absolute top-2 right-2 text-gray-300"><Lock size={16} /></div>}
                            
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-b-[3px] shadow-sm
                                ${!unlocked ? "bg-gray-100 text-gray-300 border-gray-200" : style}
                            `}>
                                <Icon size={28} />
                            </div>
                            
                            <div>
                                <h4 className="font-black text-gray-800">{badge.name}</h4>
                                <p className="text-xs font-bold text-gray-400 leading-tight mb-1">{badge.description}</p>
                                {!unlocked && (
                                    <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase">
                                        Wymaga Lvl {badge.required_level}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      <Link href="/dashboard" className="block">
        <Button3D variant="neutral" fullWidth>
            <div className="flex items-center justify-center gap-2">
                <ArrowLeft size={20} /> Wróć do Menu
            </div>
        </Button3D>
      </Link>

    </div>
  );
}