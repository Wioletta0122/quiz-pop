"use client";

import Link from "next/link";
import { Github, Linkedin, Heart, GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/quiz")) {
    return null;
  }

  return (
    <footer className="mt-auto pt-12 pb-6 px-4">
      
      <div className="max-w-5xl mx-auto bg-white border-4 border-gray-200 rounded-[40px] shadow-sm overflow-hidden">
        
        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-3xl">🦊</span>
                <span className="text-2xl font-black text-gray-800">
                    Quiz<span className="text-[#8b5cf6]">Pop</span>
                </span>
            </div>
            <p className="text-gray-500 font-bold text-sm leading-relaxed">
              Interaktywna platforma do nauki web devu.
              Zbieraj XP, wbijaj rangi i zostań mistrzem kodu!
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-3">
             <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm">O Projekcie</h3>
             <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <GraduationCap size={18} className="text-[#8b5cf6]" />
                <span>Aplikacje Internetowe</span>
             </div>
             <p className="text-gray-400 text-xs font-bold">
                Inżynieria i Analiza Danych
             </p>
             <p className="text-gray-400 text-xs">
                Rok akademicki 2024/2025
             </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
             <h3 className="font-black text-gray-800 uppercase tracking-wider text-sm">Autorzy</h3>
             
             <div className="flex gap-3">
                <a 
                  href="https://github.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-3 rounded-xl text-gray-600 hover:bg-[#8b5cf6] hover:text-white transition-all hover:-translate-y-1"
                >
                    <Github size={20} />
                </a>
                <a 
                  href="https://linkedin.com/in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-3 rounded-xl text-gray-600 hover:bg-[#0077b5] hover:text-white transition-all hover:-translate-y-1"
                >
                    <Linkedin size={20} />
                </a>
             </div>
             <p className="text-gray-400 text-xs font-bold">
                Created by <span className="text-gray-600">Maciek Gilecki i Wioletta Grabias</span>
             </p>
          </div>

        </div>

        <div className="bg-gray-50 border-t-2 border-gray-100 p-4 text-center">
            <p className="text-gray-400 text-xs font-bold flex items-center justify-center gap-1">
                Zbudowano z <Heart size={12} className="text-red-400 fill-red-400" /> przy użyciu Next.js 15 & Supabase
            </p>
        </div>

      </div>
    </footer>
  );
}