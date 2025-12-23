"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Button3D from "@/components/Button3D";
import { ArrowRight, Zap } from "lucide-react"; 
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/utils/supabase";

function QuizGame() {
  const { lives, loseLife, addXp, finishGame, dailyChallenge } = useGame(); 
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "js";
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [gameSaved, setGameSaved] = useState(false);
  
  const [hasBonus, setHasBonus] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase.from('questions').select('*').eq('category', category);
      if (data && data.length > 0) setQuestions(data);
      setLoadingQuestions(false);
    };
    fetchQuestions();
  }, [category]);

  useEffect(() => {
    if (isFinished && !gameSaved) {
      let multiplier = 1;
      if (dailyChallenge && dailyChallenge.category === category) {
         multiplier = dailyChallenge.bonus_multiplier;
         setHasBonus(true);
      }

      const baseXp = score * 25;
      const totalXp = baseXp * multiplier;

      setXpGained(totalXp);
      addXp(totalXp);
      
      const isPerfect = score === questions.length && questions.length > 0;
      finishGame(isPerfect); 
      setGameSaved(true);
    }
  }, [isFinished, gameSaved, score, questions.length, addXp, finishGame, category, dailyChallenge]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correct_index;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    else loseLife();
  };

  const nextQuestion = () => {
    setSelectedAnswer(null); setIsCorrect(null);
    if (currentQuestion + 1 < questions.length) setCurrentQuestion(currentQuestion + 1);
    else setIsFinished(true);
  };

  if (loadingQuestions) return <div className="text-center p-20 font-black text-2xl text-gray-400 animate-pulse">Ładowanie Pytań...</div>;
  if (questions.length === 0) return <div className="text-center p-20 font-bold">Brak pytań w tej kategorii! Sprawdź bazę danych.</div>;
  if (lives === 0) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-bounce-slow">
        <div className="text-8xl">💀</div>
        <h1 className="text-4xl font-black text-red-500">GAME OVER</h1>
        <p className="text-xl font-bold text-gray-500 max-w-xs">Straciłeś wszystkie serca! Wróć, gdy odpoczniesz.</p>
        <Link href="/dashboard"><Button3D variant="danger" fullWidth>Wróć do Menu</Button3D></Link>
      </div>
  );

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="text-8xl animate-bounce">🏆</div>
        <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-800">Dobra Robota!</h1>
            <p className="text-lg text-gray-400 font-bold uppercase tracking-widest">Kategoria: {category}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm w-full max-w-xs space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-500">Wynik:</span>
                <span className="text-green-500">{score} / {questions.length}</span>
            </div>
            
            <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-500">XP:</span>
                <div className="flex flex-col items-end">
                   <span className="text-yellow-500">+{xpGained} XP</span>
                   {hasBonus && (
                      <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                         <Zap size={10} fill="currentColor" /> BONUS x{dailyChallenge?.bonus_multiplier}
                      </span>
                   )}
                </div>
            </div>
        </div>
        <Link href="/dashboard" className="w-full max-w-xs">
          <Button3D variant="primary" fullWidth>Odbierz Nagrodę</Button3D>
        </Link>
      </div>
    );
  }

  const questionData = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      
      <div className="text-center flex flex-col items-center gap-2">
        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Kategoria: {category}
        </span>
        {dailyChallenge?.category === category && (
             <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Zap size={12} fill="currentColor" /> BONUS AKTYWNY
            </span>
        )}
      </div>

      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}></div>
      </div>

      <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 border-b-[6px] shadow-sm text-center min-h-[200px] flex items-center justify-center relative">
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 relative z-10">{questionData.question}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionData.answers.map((answer: string, index: number) => {
          let variant: "neutral" | "success" | "danger" = "neutral";
          if (selectedAnswer !== null) {
            if (index === questionData.correct_index) variant = "success";
            else if (index === selectedAnswer) variant = "danger";
          }
          return (<Button3D key={index} variant={variant} fullWidth onClick={() => handleAnswer(index)}>{answer}</Button3D>);
        })}
      </div>

      <div className="h-16 flex justify-center items-center">
        {selectedAnswer !== null && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Button3D onClick={nextQuestion} variant="primary">
                    <div className="flex items-center gap-2">{currentQuestion + 1 === questions.length ? "Zakończ" : "Dalej"} <ArrowRight size={20} /></div>
                </Button3D>
            </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
    return (
        <Suspense fallback={<div className="text-center p-10 font-bold text-gray-400">Ładowanie quizu...</div>}>
            <QuizGame />
        </Suspense>
    );
}