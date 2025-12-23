"use client";

import Link from "next/link";
import { 
  Code, Palette, Atom, Database, Lock, Target, BookOpen, Crown, 
  Home, Trophy, ShoppingBag, Settings, Backpack, LogOut, Edit2, Star, Shield, Zap, LucideIcon, Check
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Button3D from "@/components/Button3D";

const iconMap: Record<string, LucideIcon> = {
  Star: Star,
  BookOpen: BookOpen,
  Target: Target,
  Zap: Zap,
  Shield: Shield,
  Crown: Crown,
};

const CategoryCard = ({ title, icon: Icon, level, borderClass, locked = false }: any) => (
  <div className={`
    group relative overflow-hidden bg-white 
    border-2 border-b-[5px] rounded-3xl p-6
    flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1 active:translate-y-0 active:border-b-2
    ${locked ? "border-gray-200 opacity-60 grayscale cursor-not-allowed" : `${borderClass}`}
  `}>
    {locked && <div className="absolute top-3 right-3 text-gray-400"><Lock size={18} /></div>}
    
    <div className={`text-5xl mb-3 transition-transform group-hover:scale-110 duration-300 ${locked ? "opacity-50" : ""}`}>
        <Icon size={48} strokeWidth={1.5} className={locked ? "text-gray-400" : ""} />
    </div>
    
    <h3 className="font-black text-lg text-gray-800 mb-1">{title}</h3>
    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        {locked ? "Wymagany Lvl 5" : `Poziom ${level}/10`}
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active = false, href, onClick }: any) => {
  const content = (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition-all duration-200 cursor-pointer
      ${active 
        ? "bg-purple-50 text-[#8b5cf6] border border-purple-100" 
        : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 border border-transparent"}
    `}>
      <Icon size={24} strokeWidth={2.5} />
      <span>{label}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return <div onClick={onClick}>{content}</div>;
};

export default function DashboardPage() {
  const { 
    xp, level, logout, name, avatar, rank,
    gamesPlayed, perfectGames, selectedBadges, updateSelectedBadges 
  } = useGame();
  
  const xpPercentage = Math.min(xp, 100); 

  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [isChoosingBadges, setIsChoosingBadges] = useState(false);
  const [tempSelected, setTempSelected] = useState<number[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data } = await supabase.from('badges').select('*').order('required_level');
      if (data) setAllBadges(data);
    };
    fetchBadges();
  }, []);

  const handleLogout = async () => {
    const confirm = window.confirm("Czy na pewno chcesz się wylogować?");
    if (confirm) {
        await logout();
    }
  };

  const startChoosing = () => {
    setTempSelected(selectedBadges || []);
    setIsChoosingBadges(true);
  };

  const toggleBadge = (badgeId: number) => {
    if (tempSelected.includes(badgeId)) {
      setTempSelected(tempSelected.filter(id => id !== badgeId));
    } else {
      if (tempSelected.length >= 3) {
        alert("Możesz wybrać maksymalnie 3 odznaki!");
        return;
      }
      setTempSelected([...tempSelected, badgeId]);
    }
  };

  const saveBadges = async () => {
    await updateSelectedBadges(tempSelected);
    setIsChoosingBadges(false);
  };

  const isBadgeUnlocked = (badge: any) => {
    if (badge.criteria_type === 'games') return gamesPlayed >= badge.criteria_value;
    if (badge.criteria_type === 'perfect') return perfectGames >= badge.criteria_value;
    return level >= badge.criteria_value;
  };

  const displayBadges = selectedBadges?.length > 0 
    ? allBadges.filter(b => selectedBadges.includes(b.id)) 
    : [];

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto relative"> 
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <nav className="hidden lg:flex w-64 flex-col gap-2 bg-white border-2 border-gray-200 rounded-3xl p-4 sticky top-24 h-[calc(100vh-120px)]">
            <SidebarItem icon={Home} label="Start" active href="/" />
            <SidebarItem icon={Trophy} label="Ranking" href="/leaderboard" />
            <SidebarItem icon={Backpack} label="Ekwipunek" href="/inventory" />
            <SidebarItem icon={ShoppingBag} label="Sklep" href="/shop" />
            <SidebarItem icon={Settings} label="Ustawienia" href="/settings" />

            <div className="mt-auto pt-4 border-t border-gray-100">
               <SidebarItem icon={LogOut} label="Wyloguj" onClick={handleLogout} />
            </div>
        </nav>

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 w-full">
          
          <section className="space-y-8">
            <div className="bg-[#8b5cf6] text-white rounded-3xl p-8 border-b-[6px] border-[#6d28d9] relative overflow-hidden">
              <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                     ⚡ Super Wyzwanie Dnia
                  </h3>
                  <p className="text-purple-100 mb-4 font-medium max-w-md">
                    Zdobądź 2x więcej punktów za quiz o Next.js 14!
                  </p>
                  <button className="bg-white text-[#8b5cf6] font-extrabold py-3 px-6 rounded-xl border-b-4 border-gray-200 hover:scale-105 active:scale-95 transition-all">
                    Zagraj Teraz
                  </button>
              </div>
              <div className="absolute -right-5 -bottom-5 text-9xl opacity-20 -rotate-12 select-none pointer-events-none">
                🚀
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-6">Wybierz Wyzwanie</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Link href="/quiz?category=js">
                  <CategoryCard 
                      title="JavaScript" icon={Code} level={4} 
                      borderClass="border-amber-400 border-b-amber-600 text-amber-500"
                  />
                </Link>

                <Link href="/quiz?category=css">
                  <CategoryCard 
                      title="CSS Master" icon={Palette} level={8} 
                      borderClass="border-blue-400 border-b-blue-700 text-blue-500"
                  />
                </Link>

                <Link href="/quiz?category=react">
                  <CategoryCard 
                      title="React.js" icon={Atom} level={2} 
                      borderClass="border-purple-400 border-b-purple-700 text-purple-500"
                  />
                </Link>

                <CategoryCard 
                    title="Backend" icon={Database} level={0} locked={true}
                />
              </div>
            </div>
          </section>

          <aside className="bg-white border-2 border-gray-200 rounded-3xl p-6 sticky top-24 h-fit">
              <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl border-[3px] border-white mb-3 shadow-[0_4px_0_#10b981]">
                      {avatar}
                  </div>
                  
                  <h3 className="font-black text-xl text-gray-800 mt-2">{name}</h3>
                  <span className="text-gray-400 font-bold text-sm uppercase tracking-wide">
                    {rank}
                  </span>
                  
                  <div className="w-full mt-5 text-left">
                      <div className="flex justify-between text-xs font-extrabold text-gray-500 mb-1">
                          <span>Level {level}</span>
                          <span>{xp}/100 XP</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${xpPercentage}%` }}
                          ></div>
                      </div>
                  </div>
              </div>

              <hr className="border-gray-100 my-6" />

              <div>
                  <div className="flex justify-between items-center mb-4">
                     <h4 className="font-extrabold text-gray-400 text-xs uppercase tracking-widest">Twoje Odznaki</h4>
                     <button onClick={startChoosing} className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1">
                        <Edit2 size={12} /> Zmień
                     </button>
                  </div>
                  
                  {displayBadges.length > 0 ? (
                      <div className="space-y-3">
                         {displayBadges.map(badge => {
                             const Icon = iconMap[badge.icon_name] || Star;
                             return (
                               <div key={badge.id} className="flex items-center gap-4 py-2 border-b border-dashed border-gray-100 last:border-0 animate-in fade-in">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-b-2 ${badge.color_class}`}>
                                      <Icon size={18} />
                                  </div>
                                  <div>
                                      <div className="font-black text-sm text-gray-800">{badge.name}</div>
                                      <div className="text-[10px] font-bold text-gray-400">{badge.description}</div>
                                  </div>
                               </div>
                             )
                         })}
                      </div>
                  ) : (
                      <div className="text-center py-4 text-gray-400 text-sm font-bold border-2 border-dashed border-gray-100 rounded-xl">
                          Wybierz odznaki do pokazania!
                      </div>
                  )}
              </div>
          </aside>

        </div>
      </div>

      {isChoosingBadges && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="text-center mb-6">
                      <h2 className="text-2xl font-black text-gray-800">Wybierz Odznaki</h2>
                      <p className="text-gray-500 font-bold">Zaznacz max 3 odznaki widoczne w profilu.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6 max-h-[60vh] overflow-y-auto p-2">
                      {allBadges.map(badge => {
                          const unlocked = isBadgeUnlocked(badge);
                          const isSelected = tempSelected.includes(badge.id);
                          const Icon = iconMap[badge.icon_name] || Star;

                          return (
                              <button 
                                key={badge.id}
                                disabled={!unlocked}
                                onClick={() => toggleBadge(badge.id)}
                                className={`
                                    relative p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all
                                    ${!unlocked ? "opacity-40 grayscale cursor-not-allowed border-gray-100 bg-gray-50" : "cursor-pointer"}
                                    ${isSelected ? "border-primary bg-purple-50 ring-2 ring-primary ring-offset-2" : "border-gray-200 hover:border-gray-300"}
                                `}
                              >
                                  {isSelected && <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5"><Check size={12}/></div>}
                                  
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge.color_class} border-b-2`}>
                                      <Icon size={20} />
                                  </div>
                                  <span className="text-xs font-bold text-gray-700 leading-tight">{badge.name}</span>
                              </button>
                          )
                      })}
                  </div>

                  <div className="flex gap-3">
                      <div className="w-full" onClick={() => setIsChoosingBadges(false)}>
                        <Button3D variant="neutral" fullWidth>Anuluj</Button3D>
                      </div>
                      <div className="w-full" onClick={saveBadges}>
                        <Button3D variant="success" fullWidth>Zapisz ({tempSelected.length}/3)</Button3D>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}