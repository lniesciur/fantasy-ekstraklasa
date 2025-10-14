# Prompt dla Generatora Proof of Concept - Fantasy Ekstraklasa Optimizer (FRONTEND FOCUS)

## Kontekst Projektu

Tworzysz **Frontend Proof of Concept** dla aplikacji **Fantasy Ekstraklasa Optimizer** - platformy łączącej automatyczne zbieranie danych, generowanie składów przez AI i intuicyjną wizualizację statystyk.

**Główna wartość**: Skrócenie czasu analizy statystyk i generowanie optymalnych składów Fantasy Ekstraklasa przez AI.

## Zakres PoC (TYLKO Frontend - 2-3 widoki)

### ✅ WŁĄCZONE w PoC (Frontend):

1. **Widok statystyk zawodników** - Tabele z filtrowaniem, sortowaniem, wyszukiwaniem
2. **Widok generowania składów** - UI do wyboru formacji, blokowania zawodników, generowania
3. **Widok wizualizacji składu** - Boisko z zawodnikami, formacje, podsumowanie

### ❌ WYKLUCZONE z PoC:

- Backend/API (będzie dodane później)
- Scraping danych (mock data)
- AI integration (mock responses)
- System kont użytkowników (auth)
- Zapisywanie składów
- System bonusów
- Transfer tips
- Historia i analytics
- Tutorial
- Admin dashboard
- Wszystkie nadmiarowe funkcje

## Stack Technologiczny (TYLKO Frontend)

### Frontend:

- **Astro 5** + **React 19** (komponenty interaktywne)
- **TypeScript 5**
- **Tailwind 4** + **Shadcn/ui**

### Mock Data:

- **Lokalne pliki JSON** z przykładowymi danymi zawodników
- **Mock AI responses** dla generowania składów
- **Static data** - bez backend integration

### Deployment:

- **Vercel/Netlify** (static hosting) - prostsze dla frontend PoC

## Wymagania Funkcjonalne PoC (Frontend)

### 1. Widok Statystyk Zawodników

**Mock Data:**

- ~400-500 zawodników z przykładowymi statystykami
- Plik JSON z danymi: name, team, position, price, fantasy_points, form, health_status

**UI Features:**

- Tabela z kolumnami: Nazwisko | Drużyna | Pozycja | Cena | Pkt Fantasy | Forma | Zdrowie
- Kolorowanie (zielony=dobry, czerwony=słaby, żółty=neutralny)
- Filtrowanie: pozycja, drużyna, cena, zdrowie
- Sortowanie po każdej kolumnie
- Wyszukiwarka zawodników
- Porównanie side-by-side (2-3 zawodników)
- Responsywność desktop + tablet

### 2. Widok Generowania Składów

**UI Components:**

- Wybór formacji (7 opcji jako klikalne karty)
- Blokowanie zawodników (5 slotów z autocomplete)
- Przycisk "Generuj skład AI" z loading state
- Walidacja: budżet 30M, max 3 z drużyny, zgodność z formacją

**Mock AI Response:**

- Symulowane generowanie (2-3s delay)
- Zwraca kompletny skład 15 zawodników
- Automatyczny wybór kapitana i vice-kapitana

### 3. Widok Wizualizacji Składu

**UI Components:**

- Wizualizacja boiska z 11 podstawowymi zawodnikami
- 4 rezerwowych poniżej boiska
- Badge (C) kapitan, (VC) vice-kapitan
- Podsumowanie: koszt, budżet, formacja
- Przyciski: "Modyfikuj", "Generuj ponownie", "Zapisz skład"
- Zmiana formacji po wygenerowaniu

## Mock Data Structure

### Plik: `data/players.json`

```json
[
  {
    "id": 1,
    "name": "Robert Lewandowski",
    "team": "Legia Warszawa",
    "position": "FWD",
    "price": 3.8,
    "fantasy_points": 125,
    "form": 8.5,
    "health_status": "Pewny",
    "predicted_lineup": true,
    "fixtures": [
      { "opponent": "Cracovia", "difficulty": "Łatwy", "home": true },
      { "opponent": "Lech", "difficulty": "Trudny", "home": false }
    ]
  }
]
```

### Plik: `data/teams.json`

```json
[
  {
    "id": 1,
    "name": "Legia Warszawa",
    "position": 3,
    "form": ["W", "W", "R"],
    "difficulty": "Średni"
  }
]
```

### Mock AI Response: `utils/mockAI.ts`

```typescript
export const generateMockLineup = (formation: string, blockedPlayers: number[]) => {
  // Symuluje AI response z 2-3s delay
  // Zwraca kompletny skład 15 zawodników
  // Z kapitana i vice-kapitana
};
```

## Wymagania Techniczne (Frontend)

### Performance:

- Ładowanie ≤2 sekund
- Mock AI generowanie ≤3 sekund
- Responsywność desktop + tablet

### UI/UX:

- Nowoczesny, intuicyjny interfejs z Tailwind + Shadcn/ui
- Kolorowanie statystyk (zielony/żółty/czerwony)
- Loading states i progress indicators
- Smooth transitions i animations
- Mobile-first responsive design

### Code Quality:

- TypeScript strict mode
- ESLint + Prettier
- Component-based architecture
- Reusable UI components

## Plan Pracy (WYMAGANA AKCEPTACJA)

### Faza 1: Setup i Foundation (1-2 dni)

1. **Setup projektu**: Astro 5 + React 19 + TypeScript + Tailwind + Shadcn/ui
2. **Mock data**: Przygotowanie plików JSON z przykładowymi danymi zawodników
3. **Routing**: 3 główne widoki (statystyki, generowanie, wizualizacja)
4. **Base components**: Layout, navigation, common UI components

### Faza 2: Core UI Features (2-3 dni)

1. **Widok statystyk**: Tabela z filtrowaniem, sortowaniem, wyszukiwaniem, porównywaniem
2. **Widok generowania**: Wybór formacji, blokowanie zawodników, mock AI response
3. **Widok wizualizacji**: Boisko z zawodnikami, formacje, podsumowanie składu

### Faza 3: Polish i Responsywność (1 dzień)

1. **Responsive design**: Desktop + tablet + mobile
2. **Animations**: Smooth transitions, loading states
3. **Error handling**: Walidacja formularzy, komunikaty błędów
4. **Deployment**: Vercel/Netlify static hosting

## Kryteria Sukcesu PoC (Frontend)

### Must-Have:

- ✅ **3 widoki działają** (statystyki, generowanie, wizualizacja)
- ✅ **Mock data wyświetla się** poprawnie w tabelach
- ✅ **Filtrowanie i sortowanie** działa na statystykach
- ✅ **Mock AI generuje** sensowne składy (zgodne z ograniczeniami)
- ✅ **UI jest intuicyjne** i nowoczesne (Tailwind + Shadcn/ui)
- ✅ **Responsywność** desktop + tablet + mobile

### Nice-to-Have:

- ✅ **Smooth animations** i transitions
- ✅ **Loading states** podczas mock AI generowania
- ✅ **Error handling** i walidacja formularzy
- ✅ **Performance** <2s ładowanie
- ✅ **Porównywanie zawodników** side-by-side

## Instrukcje dla Generatora

**WAŻNE**:

1. **Rozplanuj pracę** zgodnie z fazami powyżej
2. **Uzyskaj moją akceptację** planu przed rozpoczęciem implementacji
3. **Skup się TYLKO na frontend** - bez backend/API integration
4. **Używaj dokładnie tego stacku technologicznego** - Astro 5 + React 19 + Tailwind + Shadcn/ui
5. **Priorytet: działający frontend PoC** - 3 widoki z mock data

**Zacznij od:**

1. Przedstawienia szczegółowego planu pracy (3 fazy)
2. Oszacowania czasu na każdą fazę
3. Identyfikacji potencjalnych ryzyk/trudności
4. **Czekania na moją akceptację** przed kodowaniem

**Cel**: Stworzyć piękny, funkcjonalny frontend PoC z 3 widokami, który pozwoli ocenić UX/UI i przygotować się do dodania backend w przyszłości.

**Mock Data Requirements:**

- ~400-500 zawodników z realistycznymi danymi
- 18 drużyn PKO BP Ekstraklasa
- Różnorodne pozycje (GK, DEF, MID, FWD)
- Różne ceny (0.5M - 4.1M)
- Różne formy i statystyki
