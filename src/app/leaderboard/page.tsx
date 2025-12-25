"use client";

import { useGame } from "@/context/GameContext";
import { 
  Trophy, Home, Backpack, ShoppingBag, Settings, LogOut, Medal 
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import Button3D from "@/components/Button3D";

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

export default function LeaderboardPage() {
  const { user, logout } = useGame();
  const [players, setPlayers] = useState<any[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase.from('profiles').select('*').order('xp', { ascending: false }).limit(20);
      if (data) setPlayers(data);
    };
    fetchLeaderboard();
  }, []);

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const getRankMedal = (index: number) => {
    if (index === 0) return <div className="text-4xl">🥇</div>;
    if (index === 1) return <div className="text-4xl">🥈</div>;
    if (index === 2) return <div className="text-4xl">🥉</div>;
    return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 border border-gray-200">{index + 1}</div>;
  };

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto relative min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <nav className="hidden lg:flex w-64 flex-col gap-2 bg-white border-2 border-gray-200 rounded-3xl p-4 sticky top-24 h-[calc(100vh-120px)]">
            <SidebarItem icon={Home} label="Start" href="/" />
            <SidebarItem icon={Trophy} label="Ranking" active href="/leaderboard" />
            <SidebarItem icon={Backpack} label="Ekwipunek" href="/inventory" />
            <SidebarItem icon={ShoppingBag} label="Sklep" href="/shop" />
            <SidebarItem icon={Settings} label="Ustawienia" href="/settings" />
            <div className="mt-auto pt-4 border-t border-gray-100">
                <SidebarItem icon={LogOut} label="Wyloguj" onClick={handleLogoutClick} />
            </div>
        </nav>

        <div className="flex-1 w-full max-w-3xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl border-2 border-amber-200">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-800">Ranking Graczy</h1>
              <p className="text-gray-500 font-bold">Najlepsi z najlepszych. Jesteś tam?</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-sm overflow-hidden">
            {players.map((player, index) => (
               <div key={player.id} className={`flex items-center gap-4 p-4 border-b border-dashed border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${player.id === user?.id ? "bg-purple-50 border-purple-100" : ""}`}>
                  <div className="w-12 flex justify-center">{getRankMedal(index)}</div>
                  <div className="w-12 h-12 bg-white rounded-full text-2xl flex items-center justify-center border-2 border-gray-100 shadow-sm">{player.avatar}</div>
                  <div className="flex-1">
                     <div className="font-black text-gray-800 text-lg leading-tight flex items-center gap-2">
                        {player.username} 
                        {player.id === user?.id && <span className="text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Ty</span>}
                     </div>
                     <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{player.selected_rank || "Nowicjusz"}</div>
                  </div>
                  <div className="text-right">
                     <div className="font-black text-gray-800 text-xl">{player.xp} XP</div>
                     <div className="text-xs font-bold text-gray-400">Poziom {player.level}</div>
                  </div>
               </div>
            ))}
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