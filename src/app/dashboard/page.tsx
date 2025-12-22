"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Code, Palette, Atom, Database, Lock, Zap, Target, BookOpen, Crown, 
  Home, Trophy, ShoppingBag, Settings, Backpack, LogOut
} from "lucide-react";
import { useGame } from "@/context/GameContext";

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

const AchievementRow = ({ icon, title, desc, locked = false, colorClass }: any) => (
  <div className={`flex items-center gap-4 py-3 border-b border-dashed border-gray-200 last:border-0`}>
    <div className={`
      w-12 h-12 rounded-2xl flex items-center justify-center text-xl border-b-[3px]
      ${locked ? "bg-gray-100 text-gray-400 border-gray-300 grayscale" : colorClass}
    `}>
      {icon}
    </div>
    <div>
      <div className={`font-black text-sm ${locked ? "text-gray-400" : "text-gray-800"}`}>{title}</div>
      <div className="text-xs font-bold text-gray-400">{desc}</div>
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
  const { xp, level, resetProgress, name, avatar } = useGame();
  
  const xpPercentage = Math.min(xp, 100); 
  const router = useRouter();

  const handleLogout = () => {
    const confirm = window.confirm("Czy na pewno chcesz zresetować postępy i wylogować?");
    if (confirm) {
        resetProgress();
        router.push("/");
    }
  };

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto"> 
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <nav className="hidden lg:flex w-64 flex-col gap-2 bg-white border-2 border-gray-200 rounded-3xl p-4 sticky top-24 h-[calc(100vh-120px)]">
            <SidebarItem icon={Home} label="Start" active href="/" />
            <SidebarItem icon={Trophy} label="Ranking" href="/leaderboard" />
            <SidebarItem icon={Backpack} label="Ekwipunek" href="#" />
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
                  <CategoryCard title="JavaScript" icon={Code} level={4} borderClass="border-amber-400 border-b-amber-600 text-amber-500" />
                </Link>
                <Link href="/quiz?category=css">
                  <CategoryCard title="CSS Master" icon={Palette} level={8} borderClass="border-blue-400 border-b-blue-700 text-blue-500" />
                </Link>
                <Link href="/quiz?category=react">
                  <CategoryCard title="React.js" icon={Atom} level={2} borderClass="border-purple-400 border-b-purple-700 text-purple-500" />
                </Link>
                <CategoryCard title="Backend" icon={Database} level={0} locked={true} />
              </div>
            </div>
          </section>

          <aside className="bg-white border-2 border-gray-200 rounded-3xl p-6 sticky top-24 h-fit">
              <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl border-[3px] border-white mb-3 shadow-[0_4px_0_#10b981]">
                      {avatar}
                  </div>
                  
                  <h3 className="font-black text-xl text-gray-800 mt-2">{name}</h3>
                  
                  <span className="text-gray-400 font-bold text-sm">Ranga: Junior Dev</span>
                  
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
                  <h4 className="font-extrabold text-gray-400 text-xs uppercase tracking-widest mb-4">Ostatnie Osiągnięcia</h4>
                  <AchievementRow icon={<Target size={20} />} title="Snajper" desc="100% poprawnych odp." colorClass="bg-orange-100 text-orange-600 border-orange-600" />
                  <AchievementRow icon={<BookOpen size={20} />} title="Kujon" desc="Ukończ 50 quizów" colorClass="bg-blue-100 text-blue-700 border-blue-700" />
                  <AchievementRow icon={<Crown size={20} />} title="Król JS" desc="Zablokowane" locked={true} />
              </div>
          </aside>

        </div>
      </div>
    </div>
  );
}