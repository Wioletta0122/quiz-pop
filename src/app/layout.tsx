import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { GameProvider } from "@/context/GameContext";

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "QuizPop",
  description: "Nauka przez zabawę",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${nunito.className} bg-background text-gray-700 antialiased min-h-screen flex flex-col`}>
        
        <GameProvider>
          
          <Header />
          
          <main className="flex-1 w-full max-w-5xl mx-auto">
              {children}
          </main>

        </GameProvider>

      </body>
    </html>
  );
}