# 🦊 Quiz Pop – Interaktywny Quiz Wiedzy

## 🎓 Projekt na zaliczenie przedmiotu **Aplikacje Internetowe**

**Autor:** *Maciek Gilecki i Wioletta Grabias* 
**Kierunek:** Inżynieria i analiza danych  
**Przedmiot:** Aplikacje internetowe  
**Prowadzący:** *dr inż. Mirosław Mazurek*

---

## 📘 Opis projektu

Aplikacja **Quiz Pop** to nowoczesna platforma edukacyjna stworzona w modelu Fullstack. Pozwala użytkownikom na interaktywne sprawdzanie wiedzy z zakresu technologii webowych (JavaScript, CSS, React) oraz backendu. Projekt został zaprojektowany w stylu wizualnym **Playful Pop**, który łączy estetykę gamifikacyjną z wysoką użytecznością.

Zastosowanie **Next.js 15 (TypeScript)** oraz **Supabase** zapewnia błyskawiczne renderowanie po stronie serwera (SSR) oraz bezpieczne i skalowalne zarządzanie danymi w chmurze.

---

## ✨ Główne cechy wizualne (Styl: Playful Pop)

- 🎨 **Bold Design:** Wyraziste, grube obramowania (`border-4`) i wysoki kontrast elementów.
- 📐 **Geometria:** Charakterystyczne zaokrąglenia narożników `rounded-3xl` nadające interfejsowi "miękki", zabawowy charakter.
- ⛑️ **Haptyka Wizualna:** Zaawansowane stany interaktywne kart (uniesienie `hover:-translate-y-2` oraz efekt wciśnięcia przycisku `active:translate-y-0`).
- 📊 **Dynamic Progress:** Autorski system pasków postępu z dynamicznym obliczaniem szerokości na podstawie danych z bazy.
- 📱 **Responsive Bento Grid:** Elastyczny układ kafelkowy dostosowujący się do każdego typu urządzenia.

---

## ⚙️ Funkcjonalności (Frontend)

- ✅ **Dynamiczny Dashboard:** Kategorie ładowane asynchronicznie z bazy danych PostgreSQL (Supabase).
- ✅ **System Mapowania Stylów:** Architektura typu *Look-up Table*, przypisująca ikony i kolory na podstawie `slug` kategorii.
- ✅ **Logic-Based Locking:** Wizualne blokowanie dostępu do kategorii (`grayscale`, `opacity-70`) na podstawie wymagań poziomowych.
- ✅ **Server-Side Rendering (SSR):** Wykorzystanie komponentów serwerowych Next.js dla optymalnego SEO i szybkości działania.
- ✅ **Micro-animations:** Płynne przejścia `transition-all` zwiększające satysfakcję z użytkowania (UX).

---

## 🧠 Technologie

| Technologia | Zastosowanie |
|-------------|--------------|
| **Next.js 15 (TS)** | Framework Fullstack (React + App Router + SSR) |
| **TypeScript** | Statyczne typowanie zapewniające większą niezawodność kodu |
| **Supabase** | Backend-as-a-Service (Baza danych PostgreSQL) |
| **Tailwind CSS** | System stylizacji Utility-First (implementacja stylu Playful Pop) |
| **Lucide React** | Biblioteka spójnych ikon wektorowych |
| **PostgreSQL** | Relacyjna baza danych (tabela `categories`) |

---

## 📂 Struktura Projektu


```text
src/
├── app/                  # Główny routing (App Router)
│   ├── dashboard/        # Widok główny z kategoriami
│   ├── inventory/        # System ekwipunku użytkownika
│   ├── leaderboard/      # Ranking najlepszych graczy
│   ├── quiz/             # Moduł pytań i odpowiedzi
│   ├── settings/         # Ustawienia profilu
│   ├── shop/             # Sklep z dodatkami
│   ├── layout.tsx        # Główny layout aplikacji
│   ├── page.tsx          # Strona startowa
│   └── globals.css       # Style globalne i konfiguracja Tailwinda
├── components/           # Reużywalne komponenty UI (Card, Progress, Icons)
├── context/              # Globalny stan aplikacji (np. UserContext)
└── ... config files      # tsconfig, tailwind.config, next.config
```
## 🛠️ Detale Implementacji Frontendu
W projekcie wykorzystano zaawansowane techniki CSS wewnątrz Tailwind:

* **Hard Shadows**: Specyficzne cieniowanie `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]` imitujące styl pop-art.
* **Guard Clauses**: Logika renderowania warunkowego sprawdzająca stan `is_locked` przed udostępnieniem interakcji.
* **Type Safety**: Wykorzystanie interfejsów TypeScript do definiowania struktury danych kategorii i pytań.

## 🚀 Instalacja i uruchomienie
### 1️⃣ Zainstaluj zależności
Otwórz terminal w folderze projektu i wykonaj:

```bash
npm install
```
