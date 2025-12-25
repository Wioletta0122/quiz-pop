"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import Button3D from "@/components/Button3D";
import Link from "next/link";
import { 
  Save, Lock, Trash2, User, RefreshCw, AlertTriangle,
  Home, Trophy, Backpack, ShoppingBag, Settings, LogOut 
} from "lucide-react";
import { supabase } from "@/utils/supabase";

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

export default function SettingsPage() {
  const { user, name, avatar, rank, updateProfile, logout } = useGame();
  
  const [newName, setNewName] = useState(name);
  const [newAvatar, setNewAvatar] = useState(avatar);
  const [password, setPassword] = useState("");
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPass, setIsLoadingPass] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setNewName(name);
    setNewAvatar(avatar);
  }, [name, avatar]);

  const handleUpdateProfile = async () => {
    setIsLoadingProfile(true);
    setMessage(null);
    try {
      await updateProfile(newName, newAvatar, rank);
      setMessage({ text: "Profil zaktualizowany! 🦊✨", type: 'success' });
    } catch (error) {
      setMessage({ text: "Błąd aktualizacji profilu.", type: 'error' });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (password.length < 6) {
      setMessage({ text: "Hasło musi mieć min. 6 znaków!", type: 'error' });
      return;
    }
    setIsLoadingPass(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      setMessage({ text: "Hasło zostało zmienione! 🔐", type: 'success' });
      setPassword("");
    } catch (error) {
      setMessage({ text: "Nie udało się zmienić hasła.", type: 'error' });
    } finally {
      setIsLoadingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.rpc('delete_own_account');
      if (error) throw error;
      await logout();
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas usuwania konta.");
      setIsDeleteModalOpen(false);
    }
  };

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const avatars = ["🦊", "🐼", "🦁", "🐯", "🐸", "🐙", "🦄", "🤖", "👽", "👻"];

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto relative min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <nav className="hidden lg:flex w-64 flex-col gap-2 bg-white border-2 border-gray-200 rounded-3xl p-4 sticky top-24 h-[calc(100vh-120px)]">
            <SidebarItem icon={Home} label="Start" href="/" />
            <SidebarItem icon={Trophy} label="Ranking" href="/leaderboard" />
            <SidebarItem icon={Backpack} label="Ekwipunek" href="/inventory" />
            <SidebarItem icon={ShoppingBag} label="Sklep" href="/shop" />
            <SidebarItem icon={Settings} label="Ustawienia" active href="/settings" />
            <div className="mt-auto pt-4 border-t border-gray-100">
                <SidebarItem icon={LogOut} label="Wyloguj" onClick={handleLogoutClick} />
            </div>
        </nav>

        <div className="flex-1 w-full max-w-3xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl border-2 border-purple-200">
              <Settings size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-800">Ustawienia Konta</h1>
              <p className="text-gray-500 font-bold">Zarządzaj swoim profilem i bezpieczeństwem.</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-2xl border-2 font-bold text-center animate-in slide-in-from-top-2 ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border-green-200' 
                : 'bg-red-100 text-red-700 border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-sm">
              <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <User className="text-purple-500" /> Edytuj Profil
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Wybierz Awatar</label>
                  <div className="flex flex-wrap gap-3">
                    {avatars.map((a) => (
                      <button
                        key={a}
                        onClick={() => setNewAvatar(a)}
                        className={`text-3xl w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                          newAvatar === a 
                            ? "bg-purple-100 border-purple-500 scale-110 shadow-md rotate-3" 
                            : "bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-300 hover:scale-105"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Twoja Ksywka</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 font-bold text-gray-700 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                    placeholder="Wpisz imię..."
                  />
                </div>

                <div onClick={!isLoadingProfile ? handleUpdateProfile : undefined}>
                  <Button3D variant="primary" fullWidth>
                      {isLoadingProfile ? <RefreshCw className="animate-spin" /> : <div className="flex items-center gap-2 justify-center"><Save size={18} /> Zapisz Zmiany</div>}
                  </Button3D>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-sm">
              <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <Lock className="text-blue-500" /> Zmień Hasło
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Nowe Hasło</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 font-bold text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    placeholder="Min. 6 znaków"
                  />
                </div>
                <div onClick={!isLoadingPass ? handleChangePassword : undefined}>
                  <Button3D variant="neutral" fullWidth>
                      {isLoadingPass ? <RefreshCw className="animate-spin" /> : "Zaktualizuj Hasło"}
                  </Button3D>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-3xl p-8 border-2 border-red-100 shadow-sm opacity-80 hover:opacity-100 transition-all">
              <h2 className="text-xl font-black text-red-600 mb-2 flex items-center gap-2">
                <AlertTriangle /> Strefa Niebezpieczna
              </h2>
              <p className="text-red-400 text-sm font-bold mb-6">
                Tej operacji nie można cofnąć. Stracisz wszystkie odznaki, XP i postęp w grze.
              </p>
              <div onClick={() => setIsDeleteModalOpen(true)}>
                <Button3D variant="danger" fullWidth>
                    <div className="flex items-center gap-2 justify-center"><Trash2 size={18} /> Usuń Konto</div>
                </Button3D>
              </div>
            </div>

          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-sm shadow-2xl border-4 border-red-100 text-center animate-in zoom-in-95">
             <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-b-4 border-red-200 shadow-inner">
                <Trash2 size={40} />
             </div>
             <h2 className="text-2xl font-black text-gray-800 mb-2">Na pewno? 😢</h2>
             <p className="text-gray-500 font-bold mb-8">
               To koniec naszej przygody. Twoje konto zostanie trwale usunięte.
             </p>
             <div className="flex flex-col gap-3">
                 <div onClick={handleDeleteAccount}>
                    <Button3D variant="danger" fullWidth>Tak, usuń wszystko</Button3D>
                 </div>
                 <div onClick={() => setIsDeleteModalOpen(false)}>
                    <Button3D variant="neutral" fullWidth>Nie, zostaję!</Button3D>
                 </div>
             </div>
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