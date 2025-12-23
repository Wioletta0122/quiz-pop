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
  Star: Star, BookOpen: BookOpen, Target: Target, Zap: Zap, Shield: Shield, Crown: Crown,
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
    default: return 'text-gray-500 bg-gray-100 border-gray-200';
  }
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
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition-all duration-200 cursor-pointer ${active ? "bg-purple-50 text-[#8b5cf6] border border-purple-100" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 border border-transparent"}`}>
      <Icon size={24} strokeWidth={2.5} />
      <span>{label}</span>
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return <div onClick={onClick}>{content}</div>;
};

const AchievementRow = ({ icon, title, desc, isUnlocked, badgeName }: any) => {
  const style = getBadgeStyle(badgeName);
  return (
    <div className={`flex items-center gap-4 py-3 border-b border-dashed border-gray-100 last:border-0`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border-b-[3px] transition-all duration-500 shadow-sm ${!isUnlocked ? "bg-gray-50 text-gray-400 border-gray-200 grayscale shadow-none" : style}`}>
        {icon}
      </div>
      <div>
        <div className={`font-black text-sm ${!isUnlocked ? "text-gray-400" : "text-gray-800"}`}>
          {title} {!isUnlocked && <span className="text-[10px] uppercase bg-gray-100 px-1.5 rounded text-gray-500 ml-1">Zablokowane</span>}
        </div>
        <div className="text-xs font-bold text-gray-400">{desc}</div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { xp, level, logout, name, avatar, rank, gamesPlayed, perfectGames, selectedBadges, updateSelectedBadges, dailyChallenge } = useGame();
  
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [isChoosingBadges, setIsChoosingBadges] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // NOWE
  const [tempSelected, setTempSelected] = useState<number[]>([]);

  const xpPercentage = Math.min(xp, 100); 

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

  const startChoosingBadges = () => {
    setTempSelected(selectedBadges || []);
    setIsChoosingBadges(true);
  };

  const toggleBadge = (id: number) => {
    if (tempSelected.includes(id)) setTempSelected(tempSelected.filter(b => b !== id));
    else if (tempSelected.length < 3) setTempSelected([...tempSelected, id]);
    else alert("Maksymalnie 3 odznaki!");
  };

  const saveBadges = async () => {
    await updateSelectedBadges(tempSelected);
    setIsChoosingBadges(false);
  };

  const isBadgeUnlocked = (b: any) => (
    b.criteria_type === 'games' ? gamesPlayed >= b.criteria_value : 
    b.criteria_type === 'perfect' ? perfectGames >= b.criteria_value : 
    level >= b.criteria_value
  );

  const displayBadges = selectedBadges?.length > 0 ? allBadges.filter(b => selectedBadges.includes(b.id)) : [];

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
                <SidebarItem icon={LogOut} label="Wyloguj" onClick={handleLogoutClick} />
            </div>
        </nav>

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 w-full">
          <section className="space-y-8">
            
            <div className="bg-[#8b5cf6] text-white rounded-3xl p-8 border-b-[6px] border-[#6d28d9] relative overflow-hidden shadow-lg shadow-purple-200">
              <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2">⚡ Super Wyzwanie Dnia</h3>
                  <p className="text-purple-100 mb-4 font-medium max-w-md text-lg">
                    {dailyChallenge ? dailyChallenge.description : "Ładowanie wyzwania..."}
                  </p>
                  {dailyChallenge && (
                    <Link href={`/quiz?category=${dailyChallenge.category}`}>
                      <button className="bg-white text-[#8b5cf6] font-extrabold py-3 px-6 rounded-xl border-b-4 border-gray-200 hover:scale-105 active:scale-95 transition-all shadow-sm">
                         Zagraj: {dailyChallenge.title}
                      </button>
                    </Link>
                  )}
              </div>
              <div className="absolute -right-5 -bottom-5 text-9xl opacity-20 -rotate-12 select-none pointer-events-none">🚀</div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-6">Wybierz Kategorię</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Link href="/quiz?category=js"><CategoryCard title="JavaScript" icon={Code} level={4} borderClass="border-amber-400 border-b-amber-600 text-amber-500 shadow-amber-100"/></Link>
                <Link href="/quiz?category=css"><CategoryCard title="CSS Master" icon={Palette} level={8} borderClass="border-blue-400 border-b-blue-700 text-blue-500 shadow-blue-100"/></Link>
                <Link href="/quiz?category=react"><CategoryCard title="React.js" icon={Atom} level={2} borderClass="border-purple-400 border-b-purple-700 text-purple-500 shadow-purple-100"/></Link>
                <Link href="/quiz?category=backend"><CategoryCard title="Backend" icon={Database} level={1} borderClass="border-gray-500 border-b-gray-700 text-gray-600 shadow-gray-200"/></Link>
              </div>
            </div>
          </section>

          <aside className="bg-white border-2 border-gray-200 rounded-3xl p-6 sticky top-24 h-fit shadow-sm">
              <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl border-[4px] border-white mb-3 shadow-[0_4px_0_#10b981,0_8px_15px_rgba(16,185,129,0.2)]">{avatar}</div>
                  <h3 className="font-black text-xl text-gray-800 mt-2">{name}</h3>
                  <span className="text-gray-400 font-bold text-sm uppercase tracking-wide">{rank}</span>
                  <div className="w-full mt-6 text-left">
                      <div className="flex justify-between text-xs font-extrabold text-gray-500 mb-1"><span>Level {level}</span><span>{xp}/100 XP</span></div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200"><div className="h-full bg-amber-400 rounded-full transition-all duration-500 shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]" style={{ width: `${xpPercentage}%` }}></div></div>
                  </div>
              </div>
              <hr className="border-gray-100 my-6" />
              <div>
                  <div className="flex justify-between items-center mb-4"><h4 className="font-extrabold text-gray-400 text-xs uppercase tracking-widest">Twoje Odznaki</h4><button onClick={startChoosingBadges} className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1"><Edit2 size={12} /> Zmień</button></div>
                  {displayBadges.length > 0 ? (
                      <div className="space-y-3">{displayBadges.map(b => { const Icon = iconMap[b.icon_name] || Star; const style = getBadgeStyle(b.name); return (<div key={b.id} className="flex items-center gap-4 py-2 border-b border-dashed border-gray-100 last:border-0"><div className={`w-10 h-10 rounded-xl flex items-center justify-center border-b-2 shadow-sm ${style}`}><Icon size={18} /></div><div><div className="font-black text-sm text-gray-800">{b.name}</div><div className="text-[10px] font-bold text-gray-400">{b.description}</div></div></div>)})}</div>
                  ) : <div className="text-center py-4 text-gray-400 text-sm font-bold border-2 border-dashed border-gray-100 rounded-xl">Wybierz odznaki!</div>}
              </div>
              <hr className="border-gray-100 my-6" />
              <div>
                  <h4 className="font-extrabold text-gray-400 text-xs uppercase tracking-widest mb-4">Osiągnięcia</h4>
                  <AchievementRow icon={<Target size={20} />} title="Snajper" desc="100% poprawnych" isUnlocked={perfectGames >= 1} badgeName="Snajper" />
                  <AchievementRow icon={<BookOpen size={20} />} title="Kujon" desc="Ukończ 5 quizów" isUnlocked={gamesPlayed >= 5} badgeName="Pilny Uczeń" />
                  <AchievementRow icon={<Crown size={20} />} title="Król JS" desc="Osiągnij 10 Level" isUnlocked={level >= 10} badgeName="Król Kodu" />
              </div>
          </aside>
        </div>
      </div>

      {isChoosingBadges && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border-2 border-gray-100">
                  <div className="text-center mb-6"><h2 className="text-2xl font-black text-gray-800">Wybierz Odznaki</h2><p className="text-gray-500 font-bold">Max 3 widoczne w profilu.</p></div>
                  <div className="grid grid-cols-3 gap-3 mb-6 max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">{allBadges.map(b => { const unlocked = isBadgeUnlocked(b); const isSelected = tempSelected.includes(b.id); const Icon = iconMap[b.icon_name] || Star; const style = getBadgeStyle(b.name); return (<button key={b.id} disabled={!unlocked} onClick={() => toggleBadge(b.id)} className={`relative p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all shadow-sm ${!unlocked ? "opacity-50 grayscale cursor-not-allowed border-gray-100 bg-gray-50 shadow-none" : "cursor-pointer"} ${isSelected ? "border-primary bg-purple-50 ring-2 ring-primary ring-offset-2 shadow-md" : "border-gray-200 hover:border-gray-300 hover:-translate-y-1 hover:shadow-md"}`}>{isSelected && <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5 shadow-sm"><Check size={12}/></div>}<div className={`w-12 h-12 rounded-xl flex items-center justify-center border-b-2 shadow-sm ${unlocked ? style : 'bg-gray-100 border-gray-200'}`}><Icon size={24} /></div><span className="text-xs font-bold text-gray-700 leading-tight">{b.name}</span></button>)})}</div>
                  <div className="flex gap-3"><div className="w-full" onClick={() => setIsChoosingBadges(false)}><Button3D variant="neutral" fullWidth>Anuluj</Button3D></div><div className="w-full" onClick={saveBadges}><Button3D variant="success" fullWidth>Zapisz</Button3D></div></div>
              </div>
          </div>
      )}

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