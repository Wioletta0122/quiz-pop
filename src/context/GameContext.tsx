"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type GameContextType = {
  xp: number;
  level: number;
  lives: number;
  name: string;
  avatar: string;
  addXp: (amount: number) => void;
  loseLife: () => void;
  buyLives: (cost: number) => boolean;
  resetProgress: () => void;
  updateProfile: (name: string, avatar: string) => void; // 👈 Nowa funkcja
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(100);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(5);
  
  const [name, setName] = useState("Nowy Gracz");
  const [avatar, setAvatar] = useState("🦊");
  
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. ODCZYT
  useEffect(() => {
    const savedData = localStorage.getItem("quizPopSave");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setXp(parsed.xp);
      setLevel(parsed.level);
      setLives(parsed.lives);
      if (parsed.name) setName(parsed.name);
      if (parsed.avatar) setAvatar(parsed.avatar);
    }
    setIsLoaded(true);
  }, []);

  // 2. ZAPIS
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("quizPopSave", JSON.stringify({ xp, level, lives, name, avatar }));
    }
  }, [xp, level, lives, name, avatar, isLoaded]);

  const addXp = (amount: number) => {
    setXp((prev) => {
      const newXp = prev + amount;
      if (newXp >= 100) {
        setLevel((l) => l + 1);
        return newXp - 100;
      }
      return newXp;
    });
  };

  const loseLife = () => {
    setLives((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const buyLives = (cost: number) => {
    if (xp >= cost) {
      setXp((prev) => prev - cost);
      setLives(5);
      return true;
    }
    return false;
  };

  const resetProgress = () => {
    setXp(0);
    setLevel(1);
    setLives(5);
    localStorage.removeItem("quizPopSave");
  };

  const updateProfile = (newName: string, newAvatar: string) => {
    setName(newName);
    setAvatar(newAvatar);
  };

  if (!isLoaded) return null;

  return (
    <GameContext.Provider value={{ xp, level, lives, name, avatar, addXp, loseLife, buyLives, resetProgress, updateProfile }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame musi być użyte wewnątrz GameProvider");
  }
  return context;
}