"use client";

import Button3D from "@/components/Button3D";
import { useGame } from "@/context/GameContext";
import { Heart, ShoppingBag, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ShopPage() {
  const { xp, lives, buyLives } = useGame();
  const [message, setMessage] = useState("");

  const handleBuyLives = () => {
    if (lives === 5) {
      setMessage("Masz już pełne zdrowie! ❤️");
      return;
    }

    const cost = 50;
    const success = buyLives(cost); // Próba zakupu

    if (success) {
      setMessage("Zakup udany! Życia odnowione! 🎉");
    } else {
      setMessage("Za mało XP! Rozwiąż więcej quizów! 💸");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      
      {/* Nagłówek Sklepu */}
      <div className="text-center space-y-2">
        <div className="inline-block p-4 bg-yellow-100 rounded-full text-yellow-600 mb-2 animate-bounce-slow">
            <ShoppingBag size={40} />
        </div>
        <h1 className="text-4xl font-black text-gray-800">Sklep Gracza</h1>
        <p className="text-gray-500 font-bold">Wydawaj swoje ciężko zarobione XP!</p>
      </div>

      {/* Wyświetlacz Twojego XP */}
      <div className="bg-primary text-white p-6 rounded-2xl shadow-lg flex justify-between items-center border-b-[6px] border-primary-dark">
        <span className="text-xl font-bold opacity-80">Twój portfel:</span>
        <span className="text-3xl font-black">{xp} XP</span>
      </div>

      {/* Komunikat o zakupie */}
      {message && (
        <div className="bg-white border-2 border-gray-200 p-4 rounded-xl text-center font-bold text-gray-600 animate-pulse">
            {message}
        </div>
      )}

      {/* Lista Przedmiotów */}
      <div className="grid gap-4">
        
        {/* Przedmiot 1: Odnowienie życia */}
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-border flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-error rounded-xl">
                    <Heart size={32} fill="currentColor" />
                </div>
                <div>
                    <h3 className="font-black text-xl text-gray-800">Pełne Zdrowie</h3>
                    <p className="text-sm text-gray-400 font-bold">Odnawia 5 serc</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="font-black text-yellow-500 text-lg">50 XP</span>
                <div onClick={handleBuyLives}>
                    <Button3D variant="success">KUP</Button3D>
                </div>
            </div>
        </div>

        {/* Przedmiot 2: Tarcza (Atrapa na przyszłość) */}
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-border flex items-center justify-between shadow-sm opacity-60 grayscale">
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

      <Link href="/dashboard" className="block mt-8">
        <Button3D variant="neutral" fullWidth>
            <div className="flex items-center justify-center gap-2">
                <ArrowLeft size={20} /> Wróć do Mapy
            </div>
        </Button3D>
      </Link>

    </div>
  );
}