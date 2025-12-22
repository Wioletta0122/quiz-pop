"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import Button3D from "@/components/Button3D";
import { ArrowLeft, Save, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AVAILABLE_AVATARS = ["🦊", "🐼", "🦁", "🐯", "🐸", "🐙", "🦄", "🤖", "👽", "👩‍💻", "👨‍💻", "🥷"];

export default function SettingsPage() {
  const { name, avatar, updateProfile } = useGame();
  const router = useRouter();

  // Lokalny stan formularza
  const [inputName, setInputName] = useState(name);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);

  const handleSave = () => {
    if (inputName.trim() === "") return alert("Podaj jakieś imię!");
    
    updateProfile(inputName, selectedAvatar); // Zapisz w Context
    router.push("/dashboard"); // Wróć do gry
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-block p-4 bg-gray-100 rounded-full text-gray-500 mb-2">
            <User size={40} />
        </div>
        <h1 className="text-4xl font-black text-gray-800">Ustawienia Profilu</h1>
        <p className="text-gray-500 font-bold">Dostosuj swoją postać!</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-6">
        
        {/* Zmiana Nazwy */}
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

        {/* Wybór Avatara */}
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

        <div onClick={handleSave}>
            <Button3D variant="success" fullWidth>
                <div className="flex items-center justify-center gap-2">
                    <Save size={20} /> Zapisz Zmiany
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