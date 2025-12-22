"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Button3D from "@/components/Button3D";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";

const allQuestions: Record<string, any[]> = {
  js: [
    {
      question: "Jaki jest wynik: typeof null?",
      answers: ["null", "object", "undefined", "number"],
      correct: 1,
    },
    {
      question: "Która metoda dodaje element na koniec tablicy?",
      answers: ["push()", "pop()", "shift()", "unshift()"],
      correct: 0,
    },
    {
        question: "Co robi 'NaN' w JS?",
        answers: ["Not a Number", "New a Number", "Null and Null", "Nic"],
        correct: 0,
    }
  ],
  css: [
    {
      question: "Co oznacza skrót CSS?",
      answers: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"],
      correct: 1,
    },
    {
      question: "Która właściwość zmienia kolor tekstu?",
      answers: ["font-color", "text-color", "color", "background-color"],
      correct: 2,
    },
    {
        question: "Jak wyśrodkować div w Flexbox?",
        answers: ["align: center", "justify-content: center", "text-align: center", "float: center"],
        correct: 1,
    }
  ],
  react: [
    {
      question: "Czym jest Hook w React?",
      answers: ["Błędem", "Klasą", "Funkcją", "Komponentem"],
      correct: 2,
    },
    {
      question: "Jak przekazać dane do dziecka?",
      answers: ["State", "Props", "Context", "Redux"],
      correct: 1,
    },
    {
        question: "Co zwraca useState?",
        answers: ["Tablicę [wartość, funkcja]", "Obiekt {val, setVal}", "Tylko wartość", "Promise"],
        correct: 0,
    }
  ]
};

function QuizGame() {
  const { lives, loseLife, addXp } = useGame();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "js";
  const questions = allQuestions[category] || allQuestions["js"];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    if (isFinished) {
      const earnedXp = score * 25;
      setXpGained(earnedXp);
      addXp(earnedXp);
    }
  }, [isFinished]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    } else {
      loseLife();
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (lives === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-bounce-slow">
        <div className="text-8xl">💀</div>
        <h1 className="text-4xl font-black text-red-500">GAME OVER</h1>
        <p className="text-xl font-bold text-gray-500 max-w-xs">
          Straciłeś wszystkie serca! Wróć, gdy odpoczniesz.
        </p>
        <Link href="/dashboard">
          <Button3D variant="danger" fullWidth>Wróć do Menu</Button3D>
        </Link>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="text-8xl animate-bounce">🏆</div>
        <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-800">Dobra Robota!</h1>
            <p className="text-lg text-gray-400 font-bold uppercase tracking-widest">
                Kategoria: {category}
            </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm w-full max-w-xs space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-500">Wynik:</span>
                <span className="text-green-500">{score} / {questions.length}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-500">XP:</span>
                <span className="text-yellow-500">+{xpGained} XP</span>
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
      
      {/* Nagłówek Kategorii */}
      <div className="text-center">
        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            Kategoria: {category}
        </span>
      </div>

      {/* Pasek postępu */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
        <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Pytanie */}
      <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 border-b-[6px] shadow-sm text-center min-h-[200px] flex items-center justify-center relative">
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 relative z-10">
          {questionData.question}
        </h2>
      </div>

      {/* Odpowiedzi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionData.answers.map((answer: string, index: number) => {
          let variant: "neutral" | "success" | "danger" = "neutral";
          if (selectedAnswer !== null) {
            if (index === questionData.correct) variant = "success";
            else if (index === selectedAnswer) variant = "danger";
          }
          return (
            <Button3D 
              key={index} 
              variant={variant} 
              fullWidth 
              onClick={() => handleAnswer(index)}
            >
              {answer}
            </Button3D>
          );
        })}
      </div>

      {/* Przycisk Dalej */}
      <div className="h-16 flex justify-center items-center">
        {selectedAnswer !== null && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Button3D onClick={nextQuestion} variant="primary">
                    <div className="flex items-center gap-2">
                        {currentQuestion + 1 === questions.length ? "Zakończ" : "Dalej"} <ArrowRight size={20} />
                    </div>
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