"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import Button3D from "@/components/Button3D";
import { ArrowLeft, Save, User, Award, Lock, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

const AVAILABLE_AVATARS = ["🦊", "🐼", "🦁", "🐯", "🐸", "🐙", "🦄", "🤖", "👽", "👩‍💻", "👨‍💻", "🥷"];

export default function SettingsPage() {
  const { name, avatar, rank, level, updateProfile } = useGame();
  const router = useRouter();

  const [inputName, setInputName] = useState(name);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const [selectedRank, setSelectedRank] = useState(rank);
  
  const [availableRanks, setAvailableRanks] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setInputName(name);
    setSelectedAvatar(avatar);
    setSelectedRank(rank);
  }, [name, avatar, rank]);

  useEffect(() => {
    const fetchRanks = async () => {
      const { data } = await supabase.from('ranks').select('*').order('min_level', { ascending: true });
      if (data) setAvailableRanks(data);
    };
    fetchRanks();
  }, []);

  const handleSave = async () => {
    if (inputName.trim() === "") return alert("Podaj jakieś imię!");
    if (inputName.length > 15) return alert("Za długa ksywka (max 15 znaków)!");

    setIsSaving(true);
    await updateProfile(inputName, selectedAvatar, selectedRank); 
    setIsSaving(false);
    
    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-block p-4 bg-gray-100 rounded-full text-gray-500 mb-2">
            <User size={40} />
        </div>
        <h1 className="text-4xl font-black text-gray-800">Edytuj Profil</h1>
        <p className="text-gray-500 font-bold">Dostosuj swoją postać i rangę!</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-sm space-y-8">

        <div className="space-y-2">
            <label className="font-black text-gray-700 ml-1">Twoja Ksywka</label>
            <input 
                type="text" 
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 font-bold text-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="Wpisz imię..."
                maxLength={15}
            />
        </div>

        <div className="space-y-2">
            <label className="font-black text-gray-700 ml-1">Wybierz Awatar</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {AVAILABLE_AVATARS.map((av) => (
                    <button
                        key={av}
                        onClick={() => setSelectedAvatar(av)}
                        className={`
                            text-3xl p-3 rounded-2xl border-2 transition-all hover:scale-110
                            ${selectedAvatar === av 
                                ? "bg-primary-light border-primary shadow-md scale-110" 
                                : "bg-white border-gray-100 grayscale opacity-70 hover:grayscale-0 hover:opacity-100"}
                        `}
                    >
                        {av}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-3">
            <label className="font-black text-gray-700 ml-1 flex items-center gap-2">
                <Award size={18} /> Wybierz Rangę
            </label>
            
            {availableRanks.length === 0 ? (
                <div className="text-gray-400 text-sm font-bold">Ładowanie rang...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableRanks.map((r) => {
                        const isUnlocked = level >= r.min_level;
                        const isSelected = selectedRank === r.name;

                        return (
                            <button
                                key={r.id}
                                disabled={!isUnlocked}
                                onClick={() => setSelectedRank(r.name)}
                                className={`
                                    relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left
                                    ${!isUnlocked 
                                        ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed" 
                                        : "bg-white hover:border-gray-300 cursor-pointer"}
                                    ${isSelected ? "border-primary ring-2 ring-primary ring-offset-2 bg-purple-50" : "border-gray-200"}
                                `}
                            >
                                <div>
                                    <div className={`font-black text-sm ${r.color_class || 'text-gray-800'}`}>
                                        {r.name}
                                    </div>
                                    {!isUnlocked && (
                                        <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                                            Wymagany Lvl {r.min_level}
                                        </div>
                                    )}
                                </div>

                                {isSelected && <div className="text-primary bg-white rounded-full p-1"><Check size={16} strokeWidth={3} /></div>}
                                {!isUnlocked && <Lock size={16} className="text-gray-300" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

        <div onClick={!isSaving ? handleSave : undefined}>
            <Button3D variant="success" fullWidth>
                <div className="flex items-center justify-center gap-2">
                    <Save size={20} /> 
                    {isSaving ? "Zapisywanie..." : "Zapisz Zmiany"}
                </div>
            </Button3D>
        </div>

      </div>

      <Link href="/dashboard" className="block">
        <Button3D variant="neutral" fullWidth>
            <div className="flex items-center justify-center gap-2">
                <ArrowLeft size={20} /> Anuluj
            </div>
        </Button3D>
      </Link>

    </div>
  );
}