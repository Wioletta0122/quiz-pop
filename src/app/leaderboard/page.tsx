"use client";

import Button3D from "@/components/Button3D";
import { useGame } from "@/context/GameContext";
import { ArrowLeft, Trophy, Medal, Crown } from "lucide-react";
import Link from "next/link";

// Lista przykładowych graczy (Boty)
const fakePlayers = [
  { id: 1, name: "Kasia Koduje", xp: 1500, avatar: "👩‍💻" },
  { id: 2, name: "Mistrz Reacta", xp: 850, avatar: "🥷" },
  { id: 3, name: "Design King", xp: 420, avatar: "🎨" },
  { id: 4, name: "Bug Hunter", xp: 200, avatar: "🐛" },
];

export default function LeaderboardPage() {
  const { xp } = useGame(); // Pobieramy TWOJE punkty

  // Tworzymy pełną listę: Boty + Ty
  const allPlayers = [
    ...fakePlayers,
    { id: 999, name: "Ty (Twój Profil)", xp: xp, avatar: "🦊", isMe: true }
  ];

  // Sortujemy: Kto ma więcej XP, ten jest wyżej!
  const sortedPlayers = allPlayers.sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      
      {/* Nagłówek */}
      <div className="text-center space-y-2">
        <div className="inline-block p-4 bg-yellow-100 rounded-full text-yellow-500 mb-2 animate-bounce-slow">
            <Trophy size={40} fill="currentColor" />
        </div>
        <h1 className="text-4xl font-black text-gray-800">Ranking Graczy</h1>
        <p className="text-gray-500 font-bold">Wspinaj się na szczyt!</p>
      </div>

      {/* Lista Wyników */}
      <div className="space-y-4">
        {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
                <div 
                    key={player.id}
                    className={`
                        relative flex items-center justify-between p-4 rounded-2xl border-2 border-b-4 
                        transition-transform hover:scale-[1.02]
                        ${player.isMe 
                            ? "bg-primary text-white border-primary-dark shadow-lg scale-105 z-10" // Ty jesteś wyróżniony
                            : "bg-white border-gray-border text-gray-700"
                        }
                    `}
                >
                    {/* Lewa strona: Pozycja + Avatar + Imię */}
                    <div className="flex items-center gap-4">
                        <div className={`
                            font-black text-2xl w-8 text-center
                            ${isTop3 ? "text-yellow-500" : "text-gray-400"}
                            ${player.isMe ? "text-white" : ""}
                        `}>
                            {rank === 1 ? <Crown size={28} className="text-yellow-400 fill-yellow-400" /> : `#${rank}`}
                        </div>
                        
                        <div className="text-3xl bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center border-2 border-gray-100">
                            {player.avatar}
                        </div>

                        <div>
                            <h3 className="font-bold text-lg leading-tight">{player.name}</h3>
                            {player.isMe && <span className="text-xs uppercase font-black bg-white/20 px-2 py-0.5 rounded text-white">To Ty!</span>}
                        </div>
                    </div>

                    {/* Prawa strona: XP */}
                    <div className="font-black text-xl flex items-center gap-1">
                        {player.xp} <span className="text-sm opacity-60 font-bold">XP</span>
                    </div>

                    {/* Medal dla Top 3 */}
                    {isTop3 && !player.isMe && (
                        <div className="absolute -top-3 -right-3 bg-yellow-400 text-white p-2 rounded-full border-2 border-white shadow-sm">
                            <Medal size={16} fill="currentColor" />
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      {/* Powrót */}
      <Link href="/" className="block mt-8">
        <Button3D variant="neutral" fullWidth>
            <div className="flex items-center justify-center gap-2">
                <ArrowLeft size={20} /> Wróć do Menu
            </div>
        </Button3D>
      </Link>

    </div>
  );
}