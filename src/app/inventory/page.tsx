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

type Badge = {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  required_level: number;
  color_class: string; // Tu przyjdzie gotowy styl z bazy (np. bg-red-100 shadow-red-200)
  criteria_type: string;
  criteria_value: number;
};

export default function InventoryPage() {
  const { level, lives, xp, gamesPlayed, perfectGames } = useGame();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data } = await supabase
        .from('badges')
        .select('*')
        .order('required_level', { ascending: true });

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
                <p className="text-gray-400 font-bold">{xp} XP (Poziom {level})</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-gray-200 border-b-[6px] p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-black text-gray-800">Kolekcja Odznak</h2>
            <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-500 shadow-inner">
                Zdobyto: {loading ? "..." : unlockedCount} / {badges.length}
            </span>
        </div>

        {loading ? (
           <div className="text-center py-10 font-bold text-gray-400 animate-pulse">Ładowanie odznak...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => {
                  const isUnlocked = isBadgeUnlocked(badge);
                  const IconComponent = iconMap[badge.icon_name] || Star;

                  return (
                      <div 
                          key={badge.id}
                          className={`
                              relative p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-3 transition-all duration-300
                              ${isUnlocked 
                                  // Dodajemy shadow-md, żeby cień z bazy był widoczny
                                  ? "bg-white border-gray-100 shadow-md scale-100 opacity-100 hover:scale-105 hover:shadow-lg" 
                                  : "bg-gray-50 border-gray-100 opacity-60 grayscale"
                              }
                          `}
                      >
                          {!isUnlocked && (
                              <div className="absolute top-2 right-2 text-gray-400">
                                  <Lock size={16} />
                              </div>
                          )}

                          <div className={`
                              w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-b-4 mb-1 transition-colors
                              ${isUnlocked ? badge.color_class : "bg-gray-200 text-gray-400 border-gray-300"}
                          `}>
                              <IconComponent size={32} strokeWidth={2} />
                          </div>

                          <div>
                              <h3 className="font-black text-gray-800 leading-tight">{badge.name}</h3>
                              <p className="text-xs font-bold text-gray-400 mt-1">{badge.description}</p>
                          </div>

                          {!isUnlocked && (
                              <div className="w-full mt-2">
                                  <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">
                                    {badge.criteria_type === 'level' && `Wymagany Lvl ${badge.criteria_value}`}
                                    {badge.criteria_type === 'games' && `Gry: ${gamesPlayed}/${badge.criteria_value}`}
                                    {badge.criteria_type === 'perfect' && `Perfekcyjne: ${perfectGames}/${badge.criteria_value}`}
                                  </p>
                                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                      <div 
                                          className="h-full bg-gray-400 rounded-full" 
                                          style={{ width: `${Math.min(100, (level / badge.criteria_value) * 100)}%` }}
                                      ></div>
                                  </div>
                              </div>
                          )}
                      </div>
                  );
              })}
          </div>
        )}
      </div>

      <Link href="/dashboard" className="block">
        <Button3D variant="neutral" fullWidth>
            <div className="flex items-center justify-center gap-2">
                <ArrowLeft size={20} /> Wróć do Dashboardu
            </div>
        </Button3D>
      </Link>

    </div>
  );
}