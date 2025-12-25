"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter, usePathname } from "next/navigation";

type DailyChallenge = {
  category: string;
  title: string;
  description: string;
  bonus_multiplier: number;
} | null;

type GameContextType = {
  xp: number;
  level: number;
  lives: number;
  name: string;
  avatar: string;
  rank: string;
  gamesPlayed: number;
  perfectGames: number;
  selectedBadges: number[];
  hasClutchWin: boolean;
  
  dailyChallenge: DailyChallenge;
  
  isLoading: boolean;
  user: any;
  
  addXp: (amount: number) => Promise<void>;
  loseLife: () => Promise<void>;
  buyLives: (cost: number) => Promise<boolean>;
  getFreeLife: () => Promise<boolean>;
  resetProgress: () => Promise<void>;
  updateProfile: (name: string, avatar: string, rank: string) => Promise<void>;
  finishGame: (isPerfect: boolean) => Promise<void>;
  updateSelectedBadges: (badgeIds: number[]) => Promise<void>;
  
  loginWithEmail: (email: string, pass: string) => Promise<{ error: string | null }>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  const [name, setName] = useState("Nowy Gracz");
  const [avatar, setAvatar] = useState("🦊");
  const [rank, setRank] = useState("Hello World");
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [perfectGames, setPerfectGames] = useState(0);
  const [selectedBadges, setSelectedBadges] = useState<number[]>([]);
  const [hasClutchWin, setHasClutchWin] = useState(false);
  
  const [lastRegenAt, setLastRegenAt] = useState<string | null>(null);
  
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchChallenge = async () => {
      const { data } = await supabase
        .from('daily_challenges')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setDailyChallenge(data);
    };
    fetchChallenge();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const protectedRoutes = ['/dashboard', '/leaderboard', '/shop', '/inventory', '/quiz', '/settings'];
    const authRoutes = ['/login', '/register'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (!user && isProtectedRoute) router.push("/login");
    if (user && isAuthRoute) router.push("/dashboard");
  }, [user, isLoading, pathname, router]);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    };
    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (!user || user.id !== session.user.id) await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || lives >= 5 || !lastRegenAt) return;

    const interval = setInterval(() => {
        checkRegenLogic(lives, lastRegenAt, user.id);
    }, 60000);

    return () => clearInterval(interval);
  }, [user, lives, lastRegenAt]);

  const checkRegenLogic = async (currentLives: number, lastRegenTimeStr: string, userId: string) => {
      if (currentLives >= 5) return;

      const lastRegen = new Date(lastRegenTimeStr);
      const now = new Date();
      const diffMs = now.getTime() - lastRegen.getTime();
      const threeHoursMs = 3 * 60 * 60 * 1000;

      if (diffMs >= threeHoursMs) {
          const heartsToAdd = Math.floor(diffMs / threeHoursMs);
          const newLives = Math.min(5, currentLives + heartsToAdd);

          if (newLives > currentLives) {
              const newTime = new Date().toISOString();
              
              await supabase.from('profiles').update({
                  lives: newLives,
                  last_regen_at: newTime
              }).eq('id', userId);

              setLives(newLives);
              setLastRegenAt(newTime);
          }
      }
  };

  const fetchProfile = async (uid: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
      if (data) {
        setXp(data.xp); setLevel(data.level); setLives(data.lives);
        setName(data.username); setAvatar(data.avatar); setRank(data.selected_rank || "Hello World");
        setGamesPlayed(data.games_played || 0); setPerfectGames(data.perfect_games || 0);
        setSelectedBadges(data.selected_badges || []);
        setHasClutchWin(data.has_clutch_win || false);
        setLastRegenAt(data.last_regen_at || new Date().toISOString());

        if (data.lives < 5 && data.last_regen_at) {
            checkRegenLogic(data.lives, data.last_regen_at, uid);
        }
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const finishGame = async (isPerfect: boolean) => {
    if (!user) return;
    const newGames = gamesPlayed + 1;
    const newPerfect = isPerfect ? perfectGames + 1 : perfectGames;
    
    const isClutch = lives === 1;

    setGamesPlayed(newGames); 
    setPerfectGames(newPerfect);
    
    const updateData: any = { 
        games_played: newGames, 
        perfect_games: newPerfect 
    };

    if (isClutch) {
        setHasClutchWin(true);
        updateData.has_clutch_win = true;
    }

    await supabase.from('profiles').update(updateData).eq('id', user.id);
  };

  const updateSelectedBadges = async (badgeIds: number[]) => {
    if (!user) return;
    const limitedIds = badgeIds.slice(0, 3);
    setSelectedBadges(limitedIds);
    await supabase.from('profiles').update({ selected_badges: limitedIds }).eq('id', user.id);
  };

  const addXp = async (amount: number) => {
    if (!user) return;
    let newXp = xp + amount;
    let newLevel = level;
    let newLives = lives;

    while (newXp >= 100) {
      newLevel += 1;
      newXp = newXp - 100;
      newLives = 5;
    }

    setXp(newXp); setLevel(newLevel); setLives(newLives);
    await supabase.from('profiles').update({ xp: newXp, level: newLevel, lives: newLives }).eq('id', user.id);
  };

  const loseLife = async () => {
    if (!user) return;
    const newLives = lives > 0 ? lives - 1 : 0;
    
    const updates: any = { lives: newLives };

    if (lives === 5 && newLives < 5) {
        const now = new Date().toISOString();
        updates.last_regen_at = now;
        setLastRegenAt(now);
    }

    setLives(newLives);
    await supabase.from('profiles').update(updates).eq('id', user.id);
  };

  const buyLives = async (cost: number) => {
    if (!user) return false;
    if (xp >= cost) {
        const newXp = xp - cost;
        setXp(newXp); setLives(5);
        await supabase.from('profiles').update({ xp: newXp, lives: 5 }).eq('id', user.id);
        return true;
    }
    return false;
  };

  const getFreeLife = async () => {
    if (!user) return false;
    if (lives === 0 && xp < 50) {
      setLives(1);
      await supabase.from('profiles').update({ lives: 1 }).eq('id', user.id);
      return true;
    }
    return false;
  };

  const updateProfile = async (newName: string, newAvatar: string, newRank: string) => {
    if (!user) return;
    setName(newName); setAvatar(newAvatar); setRank(newRank);
    await supabase.from('profiles').update({ username: newName, avatar: newAvatar, selected_rank: newRank }).eq('id', user.id);
  };

  const resetProgress = async () => {
      if(!user) return;
      await supabase.from('profiles').update({ xp: 0, level: 1, lives: 5, games_played: 0, perfect_games: 0, selected_badges: [], selected_rank: 'Hello World', has_clutch_win: false }).eq('id', user.id);
      setXp(0); setLevel(1); setLives(5); setGamesPlayed(0); setPerfectGames(0); setSelectedBadges([]); setRank('Hello World'); setHasClutchWin(false);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (!error) { router.refresh(); router.push("/dashboard"); } else setIsLoading(false);
    return { error: error?.message || null };
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        data: {
          name: name,
          full_name: name,
          avatar_url: '🦊'
        }
      }
    });

    if (error) { setIsLoading(false); return { error: error.message }; }
    
    if (data.user) {
      setUser(data.user); setName(name); setXp(0); setLevel(1); setLives(5); setAvatar('🦊'); setRank('Hello World'); setHasClutchWin(false);
      router.refresh(); router.push("/dashboard");
    } else { setIsLoading(false); }
    return { error: null };
  };

  const logout = async () => {
    setIsLoading(true); setUser(null); await supabase.auth.signOut();
    router.refresh(); router.push("/login"); setIsLoading(false);
  };

  return (
    <GameContext.Provider value={{ 
        xp, level, lives, name, avatar, rank, gamesPlayed, perfectGames, selectedBadges, hasClutchWin,
        dailyChallenge,
        isLoading, user,
        addXp, loseLife, buyLives, getFreeLife, resetProgress, updateProfile, finishGame, updateSelectedBadges,
        loginWithEmail, registerWithEmail, logout 
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame musi być użyte wewnątrz GameProvider");
  return context;
}