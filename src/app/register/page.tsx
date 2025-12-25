"use client";

import { useState } from "react";
import Button3D from "@/components/Button3D";
import { useGame } from "@/context/GameContext";
import { UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function RegisterPage() {
  const { registerWithEmail, isLoading } = useGame();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.length < 3) {
        setError("Ksywka musi mieć min. 3 znaki!");
        return;
    }

    if (!captchaToken) {
        setError("Potwierdź, że nie jesteś robotem! 🤖");
        return;
    }

    const res = await registerWithEmail(email, password, username, captchaToken);
    if (res.error) setError(res.error);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fff7ed] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      
      <div className="w-full max-w-md space-y-8">
        
        <div className="text-center space-y-2">
            <div className="text-6xl animate-bounce-slow">🚀</div>
            <h1 className="text-4xl font-black text-gray-800">Dołącz do Gry!</h1>
            <p className="text-gray-500 font-bold">Stwórz konto i zbieraj XP.</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white p-8 rounded-3xl border-2 border-gray-200 border-b-[6px] space-y-5 shadow-sm">
            
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold border border-red-100 text-center">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="font-black text-gray-700 ml-1">Twoja Ksywka</label>
                <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 font-bold focus:outline-none focus:border-primary transition-colors"
                    placeholder="MistrzKodu"
                    maxLength={15}
                />
            </div>

            <div className="space-y-2">
                <label className="font-black text-gray-700 ml-1">Email</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 font-bold focus:outline-none focus:border-primary transition-colors"
                    placeholder="adres@email.com"
                />
            </div>

            <div className="space-y-2">
                <label className="font-black text-gray-700 ml-1">Hasło</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3 font-bold focus:outline-none focus:border-primary transition-colors"
                    placeholder="Minimum 6 znaków"
                    minLength={6}
                />
            </div>

            <div className="flex justify-center py-2">
                <HCaptcha 
                  sitekey="24487f82-9546-4770-872e-461cbc622d68" 
                  onVerify={(token) => setCaptchaToken(token)}
                />
            </div>

            <Button3D variant="success" fullWidth>
                <div className="flex items-center justify-center gap-2">
                    {isLoading ? "Tworzenie..." : "Zarejestruj się"} <UserPlus size={20} />
                </div>
            </Button3D>

        </form>

        <div className="text-center">
            <p className="text-gray-500 font-bold mb-2">Masz już konto?</p>
            <Link href="/login">
                <Button3D variant="neutral" fullWidth>
                    <div className="flex items-center justify-center gap-2">
                        Zaloguj się <ArrowRight size={20} />
                    </div>
                </Button3D>
            </Link>
        </div>

      </div>
    </main>
  );
}