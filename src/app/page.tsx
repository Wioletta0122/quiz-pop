import Button3D from "@/components/Button3D";
import { Trophy, Play, Star, LogOut } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-10">
      
      {/* Sekcja Logo */}
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce-slow">🦊</div>
        <h1 className="text-5xl font-black text-gray-800 tracking-tight">
          Quiz<span className="text-primary">Pop</span>
        </h1>
        <p className="text-xl text-gray-500 font-bold">
          Najlepszy sposób na naukę!
        </p>
      </div>

      {/* Menu Główne */}
      <div className="grid gap-5 w-full max-w-xs">
        
        {/* Graj teraz */}
        <Link href="/dashboard" className="w-full">
          <Button3D variant="success" fullWidth>
            <div className="flex items-center justify-center gap-2">
              <Play size={24} fill="currentColor" /> Graj Teraz
            </div>
          </Button3D>
        </Link>

        {/* ranking */}
        <Link href="/leaderboard" className="w-full">
          <Button3D variant="primary" fullWidth>
            <div className="flex items-center justify-center gap-2">
              <Trophy size={24} /> Ranking
            </div>
          </Button3D>
        </Link>

        {/* Sklep */}
        <Link href="/shop" className="w-full">
          <Button3D variant="neutral" fullWidth>
            <div className="flex items-center justify-center gap-2">
              <Star size={24} className="text-yellow-400 fill-yellow-400" /> Sklep
            </div>
          </Button3D>
        </Link>

        {/* wyloguj */}
        <Button3D variant="danger" fullWidth>
          <div className="flex items-center justify-center gap-2">
            <LogOut size={20} /> Wyloguj
          </div>
        </Button3D>

      </div>

    </main>
  );
}