"use client";

import { useGame } from "@/context/GameContext";
import { 
  Backpack, Star, BookOpen, Target, Zap, Shield, Crown, Clover,
  Home, Trophy, ShoppingBag, Settings, LogOut, LucideIcon 
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import Button3D from "@/components/Button3D";

const iconMap: Record<string, LucideIcon> = {
  Star: Star, BookOpen: BookOpen, Target: Target, Zap: Zap, Shield: Shield, Crown: Crown, Clover: Clover,
};

const SidebarItem = ({ icon: Icon, label, active = false, href, onClick }: any) => {
  const content = (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition-all duration-200 cursor-pointer ${active ? "bg-purple-50 text-[#8b5cf6] border border-purple-100" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 border border-transparent"}`}>
      <Icon size={24} strokeWidth={2.5} />
      <span>{label}</span>
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return <div onClick={onClick}>{content}</div>;
};

const getBadgeStyle = (name: string) => {
  switch (name) {
    case 'Początkujący': return 'text-yellow-600 bg-yellow-100 border-yellow-200 shadow-yellow-200';
    case 'Pilny Uczeń': return 'text-blue-600 bg-blue-100 border-blue-200 shadow-blue-200';
    case 'Snajper': return 'text-red-600 bg-red-100 border-red-200 shadow-red-200';
    case 'Szybki Bill': return 'text-purple-600 bg-purple-100 border-purple-200 shadow-purple-200';
    case 'Niezniszczalny': return 'text-green-600 bg-green-100 border-green-200 shadow-green-200';
    case 'Król Kodu': return 'text-amber-700 bg-amber-100 border-amber-400 shadow-amber-300';
    case 'Mistrz Next.js': return 'text-white bg-black border-gray-600 shadow-gray-400';
    case 'Szczęściarz': return 'text-emerald-600 bg-emerald-100 border-emerald-200 shadow-emerald-200';
    default: return 'text-gray-500 bg-gray-100 border-gray-200';
  }
};

export default function InventoryPage() {
  const { isBadgeUnlocked, logout } = useGame();
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data } = await supabase.from('badges').select('*').order('required_level');
      if (data) setAllBadges(data);
    };
    fetchBadges();
  }, []);

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto relative min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <nav className="hidden lg:flex w-64 flex-col gap-2 bg-white border-2 border-gray-200 rounded-3xl p-4 sticky top-24 h-[calc(100vh-120px)]">
            <SidebarItem icon={Home} label="Start" href="/" />
            <SidebarItem icon={Trophy} label="Ranking" href="/leaderboard" />
            <SidebarItem icon={Backpack} label="Ekwipunek" active href="/inventory" />
            <SidebarItem icon={ShoppingBag} label="Sklep" href="/shop" />
            <SidebarItem icon={Settings} label="Ustawienia" href="/settings" />
            <div className="mt-auto pt-4 border-t border-gray-100">
                <SidebarItem icon={LogOut} label="Wyloguj" onClick={handleLogoutClick} />
            </div>
        </nav>

        <div className="flex-1 w-full max-w-4xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl border-2 border-blue-200">
              <Backpack size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-800">Twój Ekwipunek</h1>
              <p className="text-gray-500 font-bold">Kolekcja Twoich trofeów i odznak.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBadges.map((badge) => {
              const unlocked = isBadgeUnlocked(badge);
              const Icon = iconMap[badge.icon_name] || Star;
              const style = getBadgeStyle(badge.name);

              return (
                <div key={badge.id} className={`bg-white rounded-3xl p-6 border-2 flex flex-col items-center text-center gap-4 transition-all ${unlocked ? "border-gray-200" : "border-gray-100 opacity-60 grayscale"}`}>
                   <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-sm border-b-[4px] ${unlocked ? style : "bg-gray-100 text-gray-300 border-gray-200"}`}>
                      <Icon size={40} />
                   </div>
                   <div>
                     <h3 className="font-black text-gray-800 text-lg">{badge.name}</h3>
                     <p className="text-gray-400 font-bold text-xs">{badge.description}</p>
                   </div>
                   {!unlocked && (
                     <div className="mt-auto pt-4 text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        Zablokowane
                     </div>
                   )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {isLogoutModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-white rounded-[40px] p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-gray-100 text-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-b-4 border-red-200 shadow-inner">
                      <LogOut size={40} strokeWidth={2.5} className="ml-1" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-800 mb-2">Uciekasz?</h2>
                  <p className="text-gray-500 font-bold mb-8 leading-tight">Na pewno chcesz się wylogować i opuścić grę?</p>
                  <div className="flex flex-col gap-3">
                      <div onClick={confirmLogout}><Button3D variant="danger" fullWidth>Tak, wyloguj</Button3D></div>
                      <div onClick={() => setIsLogoutModalOpen(false)}><Button3D variant="neutral" fullWidth>Zostaję!</Button3D></div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}