# 🦊 Quiz Pop – Interaktywny Quiz Wiedzy

## 🎓 Projekt na zaliczenie przedmiotu **Aplikacje Internetowe**

**Autor:** *Maciek Gilecki i Wioletta Grabias*  
**Kierunek:** Inżynieria i analiza danych  
**Przedmiot:** Aplikacje internetowe  
**Prowadzący:** *dr inż. Mirosław Mazurek*

---

## 📘 Opis projektu

Aplikacja **Quiz Pop** to nowoczesna platforma edukacyjna typu Fullstack, łącząca naukę technologii webowych (JS, CSS, React, Backend) z zaawansowaną gamifikacją. Projekt wyróżnia się unikalnym stylem wizualnym **Playful Pop**, który poprzez żywą kolorystykę, geometryczne kształty i mikro-interakcje zwiększa zaangażowanie użytkownika.

System oparty jest na **Next.js 15** (Server Components) oraz **Supabase**, co gwarantuje wydajność, bezpieczeństwo danych i skalowalność.

---

## ✨ Główne cechy wizualne (Styl: Playful Pop)

- 🎨 **Bold Design:** Wyraziste obramowania (`border-4`), pastelowa paleta barw i wysoki kontrast.
- 📐 **Geometria & 3D:** Zaokrąglenia `rounded-3xl` oraz autorskie komponenty przycisków 3D (`Button3D`), reagujące na kliknięcia fizycznym przesunięciem.
- ⛑️ **Haptyka Wizualna:** Zaawansowane stany interaktywne (hover, active, focus) dające wrażenie "namacalności" interfejsu.
- 📱 **Responsive Bento Grid:** Nowoczesny układ kafelkowy, skalujący się płynnie od urządzeń mobilnych po desktopy.
- 🌑 **Pattern Backgrounds:** Wykorzystanie CSS `radial-gradient` do tworzenia subtelnych tekstur tła.

---

## ⚙️ Kluczowe Funkcjonalności

### 🖥️ Frontend (Next.js + React)
- **Gamifikacja:** System poziomów, pasków postępu (XP) oraz dynamicznie obliczanych statystyk.
- **Bezpieczna Rejestracja:** Integracja z **hCaptcha** w celu ochrony przed botami.
- **Dynamiczny Dashboard:** Kategorie i wyzwania dnia ładowane asynchronicznie.
- **System Odznak i Rang:** Wizualizacja osiągnięć w profilu gracza.
- **Sklep i Waluta:** Możliwość kupowania dodatkowych żyć za zdobyte punkty XP.

### 🗄️ Backend & Baza Danych (Supabase)
- **Lazy Regen System:** Autorski algorytm regeneracji żyć oparty na znacznikach czasowych (`last_regen_at`), działający nawet gdy użytkownik jest offline.
- **Row Level Security (RLS):** Zaawansowane polityki bezpieczeństwa – użytkownik może edytować tylko własny profil.
- **Custom SQL Functions (RPC):** Dedykowane procedury składowane, np. `delete_own_account` do bezpiecznego usuwania danych kaskadowo.
- **Authentication:** Pełny system logowania, rejestracji, resetowania hasła i weryfikacji email z niestandardowymi szablonami HTML.

---

## 🧠 Technologie

| Technologia | Zastosowanie |
|-------------|--------------|
| **Next.js 15 (App Router)** | Framework Fullstack (SSR + Client Components) |
| **TypeScript** | Statyczne typowanie zapewniające stabilność kodu |
| **Supabase (PostgreSQL)** | Baza danych, Auth, Realtime, Edge Functions |
| **Tailwind CSS** | Zaawansowana stylizacja Utility-First |
| **hCaptcha** | Ochrona formularzy przed spamem |
| **Lucide React** | Spójny system ikon wektorowych |

---

## 📂 Struktura Bazy Danych

Projekt wykorzystuje relacyjną bazę PostgreSQL z następującymi kluczowymi tabelami:

1.  **`profiles`** – Rozszerzenie tabeli `auth.users`. Przechowuje XP, level, życie, wybraną rangę i statystyki.
2.  **`badges`** – Słownik dostępnych odznak z logiką ich zdobywania (kryteria: level, gry, perfect game).
3.  **`ranks`** – System rang (tytułów) odblokowywanych wraz z poziomem.
4.  **`questions`** – Baza pytań quizowych z podziałem na kategorie.
5.  **`daily_challenges`** – Codzienne wyzwania z mnożnikiem punktów.

---

## 📂 Struktura Projektu

```text
src/
├── app/                  # Routing (App Router)
│   ├── auth/             # Obsługa callbacków autoryzacji
│   ├── dashboard/        # Centrum dowodzenia gracza
│   ├── inventory/        # Podgląd zdobytych odznak
│   ├── leaderboard/      # Ranking globalny graczy
│   ├── quiz/             # Logika gry (pytania, timer, wyniki)
│   ├── register/         # Rejestracja z hCaptcha
│   ├── settings/         # Edycja profilu, zmiana hasła, usuwanie konta
│   └── shop/             # Mechanika sklepu (kupowanie żyć)
├── components/           # Reużywalne UI (Button3D, Modal, Sidebar)
├── context/              # GameContext (Globalny stan gry i logiki)
└── utils/                # Klient Supabase i funkcje pomocnicze
```
## 🛠️ Detale Implementacji Frontendu
W projekcie wykorzystano zaawansowane techniki CSS wewnątrz Tailwind:

* **Hard Shadows**: Specyficzne cieniowanie `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]` imitujące styl pop-art.
* **Guard Clauses**: Logika renderowania warunkowego sprawdzająca stan `is_locked` przed udostępnieniem interakcji.
* **Type Safety**: Wykorzystanie interfejsów TypeScript do definiowania struktury danych kategorii i pytań.

## 🚀 Instalacja i uruchomienie

### 1️⃣ Wymagania wstępne
- **Node.js 18+**
- **Konto na platformie Supabase**
- **Klucze API hCaptcha**

```bash
npm install
```
