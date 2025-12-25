"use client";

import Button3D from "@/components/Button3D";
import { useGame } from "@/context/GameContext";
import { 
  Heart, ShoppingBag, ShieldCheck, Home, Trophy, Backpack, Settings, LogOut 
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

export default function ShopPage() {
  const { xp, lives, buyLives, getFreeLife, logout } = useGame();
  const [message, setMessage] = useState("");
  const [isBuying, setIsBuying] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleBuyLives = async () => {
    if (lives === 5) {
      setMessage("Masz już pełne zdrowie! ❤️");
      return;
    }
    setIsBuying(true);
    setMessage("");
    const cost = 50;
    const success = await buyLives(cost);
    if (success) {
      setMessage("Zakup udany! Życia odnowione! 🎉");
    } else {
      setMessage("Za mało XP! Rozwiąż więcej quizów! 💸");
    }
    setIsBuying(false);
  };

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
            <SidebarItem icon={Backpack} label="Ekwipunek" href="/inventory" />
            <SidebarItem icon={ShoppingBag} label="Sklep" active href="/shop" />
            <SidebarItem icon={Settings} label="Ustawienia" href="/settings" />
            <div className="mt-auto pt-4 border-t border-gray-100">
                <SidebarItem icon={LogOut} label="Wyloguj" onClick={handleLogoutClick} />
            </div>
        </nav>

        <div className="flex-1 w-full max-w-3xl mx-auto space-y-8">
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl border-2 border-yellow-200">
                <ShoppingBag size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-800">Sklep Gracza</h1>
                <p className="text-gray-500 font-bold">Wydawaj swoje ciężko zarobione XP!</p>
              </div>
            </div>

            <div className="bg-[#8b5cf6] text-white p-6 rounded-2xl shadow-lg flex justify-between items-center border-b-[6px] border-[#7c3aed]">
              <span className="text-xl font-bold opacity-80">Twój portfel:</span>
              <span className="text-3xl font-black">{xp} XP</span>
            </div>

            {message && (
              <div className="bg-white border-2 border-gray-200 p-4 rounded-xl text-center font-bold text-gray-600 animate-pulse">
                  {message}
              </div>
            )}

            <div className="grid gap-4">
              
              {lives === 0 && xp < 50 && (
                <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200 border-dashed flex items-center justify-between shadow-sm animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-500 rounded-xl">
                            <Heart size={32} className="fill-current animate-beat" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-red-600">Ostatnia Szansa</h3>
                            <p className="text-sm text-red-400 font-bold">Jesteś spłukany? Masz tu 1 życie!</p>
                        </div>
                    </div>
                    <div onClick={async () => {
                      await getFreeLife();
                      setMessage("Uff! Wracaj do gry! ❤️");
                    }}>
                        <Button3D variant="danger">Odbierz</Button3D>
                    </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 text-red-500 rounded-xl">
                          <Heart size={32} fill="currentColor" />
                      </div>
                      <div>
                          <h3 className="font-black text-xl text-gray-800">Pełne Zdrowie</h3>
                          <p className="text-sm text-gray-400 font-bold">Odnawia 5 serc</p>
                      </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                      <span className="font-black text-yellow-500 text-lg">50 XP</span>
                      <div onClick={!isBuying ? handleBuyLives : undefined}>
                          <Button3D variant={lives === 5 ? "neutral" : "success"}>
                            {isBuying ? "..." : "KUP"}
                          </Button3D>
                      </div>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 flex items-center justify-between shadow-sm opacity-60 grayscale cursor-not-allowed">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 text-blue-500 rounded-xl">
                          <ShieldCheck size={32} />
                      </div>
                      <div>
                          <h3 className="font-black text-xl text-gray-800">Tarcza (Wkrótce)</h3>
                          <p className="text-sm text-gray-400 font-bold">Chroni przed 1 błędem</p>
                      </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                      <span className="font-black text-gray-400 text-lg">100 XP</span>
                      <Button3D variant="neutral">KUP</Button3D>
                  </div>
              </div>

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