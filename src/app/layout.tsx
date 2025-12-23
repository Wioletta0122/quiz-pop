import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizPop",
  description: "Najlepsza gra quizowa w sieci",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦊</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${nunito.className} bg-[#fff7ed] min-h-screen pb-24 lg:pb-0`}>
        <GameProvider>
          <Header />
          {children}
          <MobileMenu />
        </GameProvider>
      </body>
    </html>
  );
}