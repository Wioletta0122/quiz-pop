"use client";

import { useState } from "react";
import Button3D from "@/components/Button3D";
import { useGame } from "@/context/GameContext";
import { LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function LoginPage() {
  const { loginWithEmail, isLoading } = useGame();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!captchaToken) {
        setError("Potwierdź, że nie jesteś robotem! 🤖");
        return;
    }
    
    const res = await loginWithEmail(email, password, captchaToken);
    
    if (res.error) {
        console.error("Błąd logowania:", res.error);
        setError(res.error);
        setCaptchaToken(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fff7ed] bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:40px_40px]">
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
            <div className="text-6xl animate-bounce-slow">🦊</div>
            <h1 className="text-4xl font-black text-gray-800">Witaj Ponownie!</h1>
            <p className="text-gray-500 font-bold">Zaloguj się, aby grać.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl border-2 border-gray-200 border-b-[6px] space-y-5">
            
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold border border-red-100 text-center animate-pulse">
                    ⚠️ {error}
                </div>
            )}

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
                    placeholder="••••••••"
                />
            </div>

            <div className="flex justify-center py-2">
                <HCaptcha 
                  sitekey="24487f82-9546-4770-872e-461cbc622d68" 
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                />
            </div>

            <Button3D variant="primary" fullWidth>
                <div className="flex items-center justify-center gap-2">
                    {isLoading ? "Logowanie..." : "Zaloguj się"} <LogIn size={20} />
                </div>
            </Button3D>

        </form>

        <div className="text-center">
            <p className="text-gray-500 font-bold mb-2">Nie masz konta?</p>
            <Link href="/register">
                <Button3D variant="neutral" fullWidth>
                    <div className="flex items-center justify-center gap-2">
                        Załóż Konto <ArrowRight size={20} />
                    </div>
                </Button3D>
            </Link>
        </div>
        
        <div className="text-center mt-4">
             <Link href="/" className="text-sm text-gray-400 font-bold hover:text-gray-600">
                Wróć na stronę główną
             </Link>
        </div>

      </div>
    </main>
  );
}