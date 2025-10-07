# Dokument Wymagań Produktowych - Fantasy Ekstraklasa Optimizer

## 1. Przegląd Produktu

### 1.1 Podstawowe Informacje
- Nazwa: Fantasy Ekstraklasa Optimizer
- Wizja: Webowa aplikacja AI oszczędzająca czas przy analizie statystyk i generowaniu optymalnych składów Fantasy Ekstraklasa
- Grupa docelowa: Doświadczeni gracze Fantasy znający polską piłkę
- Harmonogram: Październik 2025 (start) → Grudzień 2025 (MVP) → Styczeń 2026 (launch)

### 1.2 Stack Technologiczny
- Frontend: Astro 5 z React 19 dla komponentów interaktywnych
- Styling: Tailwind 4 + Shadcn/ui
- Backend: Supabase (PostgreSQL + Auth + Real-time)
- Scraping: Node.js/Python (zamiast C# dla lepszej integracji)
- AI: Openrouter.ai (dostęp do wielu modeli: Claude, GPT, Gemini)
- Deployment: DigitalOcean (Docker) + GitHub Actions CI/CD
- Monitoring: Sentry (błędy) + Vercel Analytics

### 1.3 Cele Produktu
- Skrócenie czasu analizy statystyk
- 75% wskaźnik akceptacji składów AI
- 75% składów AI z 50+ punktami
- 100 użytkowników w 3 miesiące

## 2. Problem Użytkownika

Przeglądanie statystyk piłkarzy PKO BP Ekstraklasa jest czasochłonne i nieefektywne, co prowadzi do wydłużonego czasu analizy i trudności w podejmowaniu optymalnych decyzji składowych przed każdą kolejką Fantasy Ekstraklasa.

Rozwiązanie: Platforma łącząca automatyczne zbieranie danych, generowanie składów przez AI i intuicyjną wizualizację statystyk.

## 3. Wymagania Funkcjonalne (Podsumowanie)

### 3.1 Import Danych
- Manualny import z Excel (szablon z walidacją)
- Automatyczny scraping fantasy.ekstraklasa.org (raz dziennie)
- Obsługa błędów z retry logic i fallback na cache
- Walidacja i komunikaty błędów

### 3.2 Przeglądanie Statystyk
Must-have statystyki:
- Punkty Fantasy (całościowe + ostatnie kolejki)
- Forma (średnia z ostatnich 2 meczów)
- Cena (maks 4.1M, budżet 30M)
- Drużyna (maks 3 z jednej)
- Kartki, stan zdrowia (Pewny/Wątpliwy/Nie zagra)
- Przewidywany skład, terminarz (3 mecze z trudnością)

Funkcje:
- Tabele z sortowaniem i filtrowaniem
- Kolorowanie (zielony=dobry, czerwony=słaby, żółty=neutralny)
- Porównanie side-by-side (2-3 zawodników)
- Wyszukiwarka zawodników

### 3.3 Generowanie Składów AI
Parametry:
- 15 zawodników (11 podstawowych + 4 rezerwowych)
- Budżet 30M
- Formacje: 1-4-4-2 (default), 1-4-3-3, 1-4-5-1, 1-5-3-2, 1-5-4-1, 1-3-5-3, 1-3-4-3
- Maks 3 zawodników z drużyny

System wagowy AI:
- Przewidywany skład: blocking factor
- Forma ostatnich 2 meczów: 40%
- Punkty Fantasy: 30%
- Optymalizacja budżetu: 20%
- Forma drużyny: 10%

Funkcje:
- Automatyczny wybór kapitana i vice-kapitana
- Blokowanie 3-5 zawodników (user control)
- Sugestie bonusów z uzasadnieniem
- Zmiana formacji przed i po generowaniu
- Generowanie w ≤30 sekund

### 3.4 System Bonusów
3 bonusy (raz na rundę):
- Ławka punktuje: punkty rezerwowych liczą się dodatkowo
- Kapitanów 2: 2 zawodników punktuje podwójnie
- Joker: najlepszy zawodnik ≤2.0M (nie kapitan) punktuje podwójnie

Funkcje:
- Panel statusu bonusów (dostępne/użyte)
- Sugestie AI z uzasadnieniem
- Identyfikacja kandydatów na jokera (1.5-2.0M)
- Podgląd Kapitanów 2 z prognozą punktów

### 3.5 Zarządzanie Składami
- Zapisywanie maks 3 wariantów
- Edycja i usuwanie składów
- Copy to clipboard (eksport tekstowy)
- Tracking modyfikacji dla analityki

### 3.6 Historia i Analytics
- Automatyczne pobieranie wyników po kolejce
- Historia min. 10 kolejek
- Porównanie AI vs finalny skład użytkownika
- Wskaźnik akceptacji AI
- Statystyki punktów w czasie

### 3.7 Transfer Tips
- 3-5 rekomendacji transferów między kolejkami
- Kryteria: forma, mecze, kontuzje, podobna cena
- Uzasadnienie dla każdej sugestii
- Porównanie OUT vs IN
- Możliwość zastosowania do składu

### 3.8 System Kont
- Rejestracja: email + hasło (Supabase Auth)
- Weryfikacja email
- Logowanie z "Zapamiętaj mnie"
- Reset hasła
- Zapisywanie składów (maks 3)
- Pełna historia
- Wszystkie funkcje

### 3.9 Onboarding
- Landing page z value proposition
- Tutorial 3-4 kroki (opcjonalny):
  1. Import danych
  2. Przeglądanie statystyk
  3. Generowanie składu
  4. System bonusów
- Dostępny z menu pomocy

### 3.10 Obsługa Błędów
- Priorytetowe komunikaty z sugestiami
- Retry logic dla scrapingu (3 próby)
- Fallback na cache
- Timeout API (60s)
- Walidacja importu z konkretnymi błędami

### 3.11 Admin i Monitoring
- Dashboard z metrykami: jakość danych, sukces scrapingu, statystyki użytkowników, wydajność AI
- Alerty o krytycznych błędach
- Logging dla analityki (RODO-compliant)

## 4. Granice Produktu

### W Zakresie MVP:
✅ Import manualny i automatyczny
✅ AI generowanie (Openrouter.ai - Claude 3.5 Sonnet)
✅ Przeglądanie i porównywanie statystyk
✅ System bonusów
✅ Transfer tips
✅ Historia i analytics
✅ Konta użytkowników (tylko zarejestrowani)
✅ Tutorial
✅ Web app (desktop + tablet)

### Poza Zakresem MVP:
❌ Tryb gościa (wszystkie funkcje wymagają logowania)
❌ Własny zaawansowany algorytm
❌ Współdzielenie składów
❌ Aplikacje mobilne
❌ Powiadomienia (email, push)
❌ Ligi/rankingi użytkowników
❌ Funkcje społecznościowe
❌ Zaawansowana analityka (wykresy)
❌ Wsparcie wielu języków
❌ Monetyzacja/premium features

## 5. Historie Użytkownika (Rozbudowane)

### 5.1 Uwierzytelnianie i Zarządzanie Kontem

#### US-001: Landing Page i Call-to-Action
ID: US-001
Tytuł: Wyświetlenie landing page jako potencjalny użytkownik
Opis: Jako potencjalny użytkownik, chcę zobaczyć wartość produktu na landing page, aby zdecydować czy chcę się zarejestrować.
Kryteria Akceptacji:
- Landing page wyświetla: nazwę produktu, tagline, kluczowe korzyści (AI, oszczędność czasu, lepsze wyniki)
- Sekcja "Jak to działa" z 4 krokami (Zarejestruj → Przeglądaj statystyki → Generuj skład → Wygraj)
- Przykładowe screenshoty interfejsu
- Testimonials/social proof (opcjonalnie, później)
- Prominentny przycisk "Zarejestruj się teraz" (CTA)
- Footer z linkami: Regulamin, Polityka Prywatności, Kontakt
- Ładowanie ≤2 sekund
- Responsywność desktop + tablet

#### US-002: Rejestracja Nowego Użytkownika
ID: US-002
Tytuł: Utworzenie nowego konta
Opis: Jako nowy użytkownik, chcę szybko zarejestrować konto, aby zacząć korzystać z aplikacji.
Kryteria Akceptacji:
- Formularz rejestracji: Email, Hasło, Potwierdź hasło
- Walidacja w czasie rzeczywistym:
  * Email: prawidłowy format, unikalność (async check)
  * Hasło: min 8 znaków, 1 wielka litera, 1 cyfra
  * Potwierdź hasło: musi się zgadzać
- Checkbox zgody RODO: "Akceptuję przetwarzanie danych osobowych" (required)
- Link do Polityki Prywatności
- Komunikaty błędów inline (czerwony tekst pod polem)
- Przycisk "Zarejestruj się" (disabled jeśli walidacja niepomyślna)
- Po sukcesie:
  * Email weryfikacyjny wysłany automatycznie w ciągu 1 minuty
  * Redirect na stronę: "Sprawdź email aby zweryfikować konto"
  * Komunikat: "Link weryfikacyjny wysłany na [email]"
- Błąd duplikatu email: "Ten email jest już zarejestrowany. Zaloguj się"
- Link "Masz już konto? Zaloguj się"
- Proces ≤2 minuty
- Używa Supabase Auth

#### US-003: Weryfikacja Email
ID: US-003
Tytuł: Aktywacja konta przez weryfikację email
Opis: Jako nowo zarejestrowany użytkownik, chcę zweryfikować email, aby aktywować konto.
Kryteria Akceptacji:
- Email weryfikacyjny zawiera:
  * Temat: "Zweryfikuj swoje konto - Fantasy Ekstraklasa Optimizer"
  * Powitanie z nazwą produktu
  * Jasny przycisk "Zweryfikuj email"
  * Link tekstowy (fallback)
  * Info: "Link wygasa za 24h"
- Kliknięcie linku weryfikuje konto w Supabase
- Redirect na stronę logowania z komunikatem sukcesu: "Email zweryfikowany! Możesz się zalogować"
- Link wygasa po 24h
- Przycisk "Wyślij ponownie" na stronie weryfikacji (jeśli nie otrzymano)
- Rate limit: max 3 emaile/godzinę
- Niewzweryfikowani użytkownicy nie mogą się zalogować (komunikat: "Zweryfikuj email przed logowaniem")

#### US-004: Logowanie Użytkownika
ID: US-004
Tytuł: Zalogowanie się na istniejące konto
Opis: Jako zarejestrowany użytkownik, chcę się zalogować, aby uzyskać dostęp do moich składów i funkcji.
Kryteria Akceptacji:
- Formularz logowania: Email, Hasło
- Checkbox "Zapamiętaj mnie" (sesja 30 dni)
- Link "Zapomniałem hasła"
- Przycisk "Zaloguj się"
- Walidacja:
  * Email: format
  * Hasło: nie puste
- Komunikaty błędów:
  * "Nieprawidłowy email lub hasło" (generic security)
  * "Email nie zweryfikowany. Sprawdź skrzynkę" (jeśli unverified)
- Po sukcesie:
  * Redirect na dashboard użytkownika
  * Toast: "Witaj z powrotem, [Imię]!"
- Rate limiting: max 5 prób/15 minut (prevent brute force)
- Link "Nie masz konta? Zarejestruj się"
- Supabase Auth session management

#### US-005: Reset Hasła
ID: US-005
Tytuł: Resetowanie zapomnianego hasła
Opis: Jako użytkownik, który zapomniał hasła, chcę je zresetować, aby odzyskać dostęp.
Kryteria Akceptacji:
- Link "Zapomniałem hasła" na stronie logowania
- Formularz reset: Email
- Po wysłaniu:
  * Komunikat: "Jeśli email istnieje, wysłaliśmy link do resetu" (security: nie ujawniaj czy email istnieje)
  * Email z linkiem resetującym (wygasa za 1h)
- Email zawiera:
  * Temat: "Zresetuj hasło - Fantasy Ekstraklasa Optimizer"
  * Przycisk "Zresetuj hasło"
  * Info o wygaśnięciu
- Kliknięcie otwiera formularz: Nowe hasło, Potwierdź hasło
- Walidacja nowego hasła (min 8 znaków, 1 wielka, 1 cyfra)
- Po sukcesie:
  * Redirect na logowanie
  * Komunikat: "Hasło zmienione. Zaloguj się nowym hasłem"
- Stare hasło przestaje działać
- Token wygasa po 1h lub po użyciu

#### US-006: Wylogowanie
ID: US-006
Tytuł: Wylogowanie z konta
Opis: Jako zalogowany użytkownik, chcę się wylogować, aby zabezpieczyć konto.
Kryteria Akceptacji:
- Przycisk/link "Wyloguj" w nawigacji (prawy górny róg, dropdown menu użytkownika)
- Kliknięcie wylogowuje natychmiast (bez confirmacji)
- Session jest zakończona w Supabase
- Redirect na landing page
- Toast: "Wylogowano pomyślnie"
- Próba dostępu do chronionych stron → redirect na logowanie
- Zapisane składy pozostają w bazie (nie są usuwane)

### 5.2 Onboarding

#### US-007: Tutorial dla Nowego Użytkownika
ID: US-007
Tytuł: Ukończenie tutorialu po pierwszym logowaniu
Opis: Jako nowy użytkownik, chcę ukończyć szybki tutorial, aby zrozumieć podstawowe funkcje.
Kryteria Akceptacji:
- Tutorial uruchamia się automatycznie po pierwszym logowaniu
- 4 kroki (każdy ~60-90s):
  1. **Import danych**: "Dane są automatycznie aktualizowane codziennie. Możesz też importować z Excel" + screenshot
  2. **Statystyki**: "Przeglądaj, filtruj i porównuj zawodników" + interaktywna demo tabeli
  3. **Generowanie**: "AI wygeneruje optymalny skład za Ciebie" + demo generowania
  4. **Bonusy**: "3 bonusy do strategicznego użycia w rundzie" + wyjaśnienie każdego
- Progress bar: 1/4, 2/4, 3/4, 4/4
- Przyciski: "Dalej", "Wstecz", "Pomiń tutorial"
- Po ukończeniu:
  * "Gratulacje! Jesteś gotowy" + confetti animacja
  * Przycisk "Rozpocznij"
  * Redirect na dashboard
- Możliwość ponownego uruchomienia z menu pomocy (? icon → "Tutorial")
- Zapisanie statusu ukończenia w profilu użytkownika
- Całkowity czas: maks 5-6 minut

#### US-008: Pominięcie Tutorialu
ID: US-008
Tytuł: Szybkie rozpoczęcie bez tutorialu
Opis: Jako doświadczony użytkownik, chcę pominąć tutorial, aby natychmiast zacząć korzystać z aplikacji.
Kryteria Akceptacji:
- Przycisk "Pomiń tutorial" widoczny na każdym kroku
- Kliknięcie pokazuje dialog: "Czy na pewno? Możesz wrócić z menu pomocy"
- Przyciski: "Tak, pomiń" / "Anuluj"
- Po potwierdzeniu → redirect na dashboard
- Status "tutorial_skipped" zapisany w profilu
- Możliwość uruchomienia później z menu pomocy

### 5.3 Import Danych

#### US-009: Automatyczny Import (Background Process)
ID: US-009
Tytuł: System automatycznie aktualizuje dane
Opis: Jako użytkownik, chcę mieć zawsze aktualne dane bez manualnej interwencji.
Kryteria Akceptacji:
- Scheduled job uruchamia scraping:
  * Codziennie o 6:00 (główna aktualizacja)
  * 2h przed kolejką (przewidywane składy)
  * Dzień po kolejce (wyniki i punkty)
- Scraping fantasy.ekstraklasa.org:
  * Parsowanie HTML → JSON
  * Wszystkie must-have statystyki
  * Zapis w Supabase
- Retry logic: 3 próby z 5-minutowym odstępem
- Po wszystkich niepowodzeniach:
  * Alert email do admina
  * Fallback na ostatnie cachowane dane
- Timestamp ostatniej aktualizacji zapisany w DB
- Użytkownik widzi wskaźnik świeżości na stronie statystyk:
  * "Ostatnia aktualizacja: 2h temu" (zielony jeśli <6h, żółty 6-24h, czerwony >24h)

#### US-010: Manualne Odświeżenie Danych
ID: US-010
Tytuł: Ręczne wymuszenie aktualizacji danych
Opis: Jako użytkownik przed ważną decyzją, chcę mieć pewność że dane są najświeższe.
Kryteria Akceptacji:
- Przycisk "Odśwież dane" (ikona ↻) na stronie statystyk
- Tooltip: "Zaktualizuj z fantasy.ekstraklasa.org"
- Kliknięcie:
  * Spinner + "Pobieranie danych..."
  * Wywołanie scraping API
  * Max czas oczekiwania: 30s
- Po sukcesie: Toast "Dane zaktualizowane" (zielony)
- Po błędzie: Toast "Nie udało się. Używamy ostatnich dostępnych" (żółty)
- Rate limit: max raz/godzinę
- Jeśli za wcześnie: "Możesz odświeżyć ponownie za 45 minut"
- Timestamp aktualizowany po udanym odświeżeniu

#### US-011: Manualny Import z Excel
ID: US-011
Tytuł: Import własnych danych z pliku Excel
Opis: Jako użytkownik z alternatywnym źródłem danych, chcę importować statystyki z Excel.
Kryteria Akceptacji:
- Strona "Import danych" w menu
- Przycisk "Pobierz szablon Excel"
  * Pobiera plik: fantasy_ekstraklasa_szablon_2025.xlsx
  * Zawiera: instrukcje, nagłówki kolumn, przykładowy wiersz, walidację
- Sekcja upload:
  * Drag & drop zone lub "Wybierz plik"
  * Akceptuje: .xlsx, .xls (max 5MB)
- Po wyborze pliku:
  * Preview pierwszych 5 wierszy
  * Walidacja:
    - Wszystkie wymagane kolumny obecne
    - Formaty danych poprawne
    - Brak duplikatów
- Komunikaty błędów inline:
  * "Wiersz 5: Nieprawidłowa cena (oczekiwano liczby)"
  * "Brak kolumny 'team'"
  * Lista wszystkich błędów z możliwością pobrania raportu
- Przycisk "Importuj" (disabled jeśli błędy krytyczne)
- Ostrzeżenia (żółte) pozwalają na import
- Po sukcesie:
  * "Zaimportowano 250 zawodników (5 z ostrzeżeniami)"
  * Imported data zastępuje istniejące dla tych zawodników
- Logging importu dla audytu

### 5.4 Przeglądanie Statystyk

#### US-012: Wyświetlenie Tabeli Zawodników
ID: US-012
Tytuł: Przeglądanie wszystkich dostępnych zawodników
Opis: Jako użytkownik, chcę zobaczyć kompletną listę zawodników z statystykami.
Kryteria Akceptacji:
- Strona "Zawodnicy" w głównej nawigacji
- Tabela z kolumnami:
  * Nazwisko | Drużyna | Pozycja | Cena | Pkt Fantasy | Forma | Zdrowie | Terminarz | Akcje
- ~400-500 zawodników z lazy loading (50/strona)
- Kolorowanie automatyczne:
  * Forma: >7 zielony, 4-7 żółty, <4 czerwony
  * Cena: <2M zielony, 2-3.5M żółty, >3.5M pomarańczowy
  * Zdrowie: Pewny zielony, Wątpliwy żółty, Nie zagra szary
- Ikony: ⚽ punkty, 🟨 kartki żółte, 🟥 czerwone, ⚕️ zdrowie, 📅 terminarz
- Hover nad wierszem: podświetlenie (light gray background)
- Ładowanie ≤2s
- Licznik: "Wyświetlono 50 z 487 zawodników"
- Infinite scroll lub paginacja
- Responsywność: desktop (wszystkie kolumny), tablet (ukryte mniej ważne)

#### US-013: Filtrowanie Zawodników
ID: US-013
Tytuł: Zawężenie listy według kryteriów
Opis: Jako użytkownik szukający konkretnego typu zawodnika, chcę zastosować filtry.
Kryteria Akceptacji:
- Panel filtrów nad tabelą (collapsible)
- Filtry dostępne:
  * Pozycja: Checkboxy multi-select (GK, DEF, MID, FWD)
  * Drużyna: Dropdown z search (18 drużyn)
  * Cena: Dual range slider (0-5M) + input pola
  * Zdrowie: Checkboxy (Pewny, Wątpliwy, Nie zagra)
  * Forma: Slider (0-10) lub kategorie (Wysoka >7, Średnia 4-7, Niska <4)
- Kombinacja filtrów (AND logic)
- Real-time update (<500ms)
- Aktywne filtry jako badges z X do usunięcia
- Przycisk "Wyczyść wszystkie"
- Brak wyników: "Nie znaleziono. Zmień filtry"
- Licznik: "12 z 487 (filtrowane)"
- URL query params (shareable link)
- Session storage (persist po refresh)

#### US-014: Sortowanie Tabeli
ID: US-014
Tytuł: Sortowanie zawodników według statystyki
Opis: Jako użytkownik, chcę sortować tabelę, aby znaleźć najlepszych w danej kategorii.
Kryteria Akceptacji:
- Każdy nagłówek kolumny ma ikonę sortowania (↕)
- Kliknięcie 1: sortowanie malejące (↓) najwyższe na górze
- Kliknięcie 2: sortowanie rosnące (↑) najniższe na górze
- Kliknięcie 3: reset (↕) domyślne (alfabetycznie)
- Aktywna kolumna: podświetlony nagłówek + bold + ikona kierunku
- Tylko jedna kolumna sortowana jednocześnie
- Działa z filtrami
- Session storage
- Domyślne: alfabetycznie po nazwisku (A-Z)
- Szybkie sortowania: "Top forma", "Najtańsi", "Najwięcej punktów"
- Update <200ms

#### US-015: Wyszukiwanie Zawodnika
ID: US-015
Tytuł: Szybkie znalezienie zawodnika po nazwisku
Opis: Jako użytkownik szukający konkretnego zawodnika, chcę użyć wyszukiwarki.
Kryteria Akceptacji:
- Pole search prominentne nad tabelą (ikona 🔍)
- Placeholder: "Szukaj zawodnika po nazwisku..."
- Real-time filtering podczas pisania (debounce 300ms)
- Dopasowanie do nazwiska (imię + nazwisko)
- Case-insensitive
- Ignoruje polskie znaki (ą→a, ł→l)
- Działa z filtrami (AND)
- Przycisk X lub ESC czyści
- Brak wyników: "Nie znaleziono: '[query]'"
- Licznik: "Znaleziono 3"
- Podświetlenie dopasowania (bold)
- Historia ostatnich 5 wyszukiwań (dropdown)

#### US-016: Szczegóły Zawodnika
ID: US-016
Tytuł: Wyświetlenie pełnych informacji o zawodniku
Opis: Jako użytkownik, chcę zobaczyć szczegółowe statystyki przed dodaniem do składu.
Kryteria Akceptacji:
- Kliknięcie nazwiska otwiera modal/side panel
- Nagłówek: Nazwisko, drużyna, pozycja, cena
- Sekcje:
  1. **Podstawowe**: Punkty Fantasy, Forma, Cena, Zdrowie, Przewidywany skład
  2. **Ostatnie występy** (5 kolejek): Tabela z przeciwnikiem, minutami, punktami
  3. **Nadchodzące mecze** (3): Przeciwnik (H/A), Trudność (kolor), Data
  4. **Zaawansowane** (opcjonalnie): Kartki, % posiadania, średnia minut
- Przyciski:
  * "Dodaj do składu" (jeśli skład otwarty)
  * "Porównaj" (dodaj do compare list)
  * "Zablokuj w generowaniu"
- Przycisk X zamyka
- Klawisze: ESC (zamknij), ← → (prev/next zawodnik)
- Loading state podczas fetch

#### US-017: Porównanie Zawodników
ID: US-017
Tytuł: Porównanie side-by-side 2-3 zawodników
Opis: Jako użytkownik decydujący między opcjami, chcę porównać zawodników bezpośrednio.
Kryteria Akceptacji:
- Checkbox przy każdym zawodniku w tabeli
- Floating button "Porównaj (0)" po wybraniu
- Licznik aktualizuje się: "Porównaj (2)"
- Maks 3 zawodników
- Próba 4-ego: tooltip "Max 3. Odznacz jednego"
- Kliknięcie "Porównaj" otwiera large modal
- Layout: 2-3 kolumny (zależnie od liczby)
- Każda kolumna:
  * Nagłówek: Nazwisko, drużyna, pozycja, cena
  * Wszystkie must-have stats w rzędach
- Kolorowanie różnic:
  * Najlepsza wartość = zielony background
  * Najgorsza = czerwony (jeśli znacząco gorsza)
- Stats do porównania: Cena, Pkt Fantasy, Forma, Zdrowie, Ostatnie 3 występy, Następne 3 mecze, Kartki
- Przyciski per zawodnik: "Wybierz tego", "Usuń z porównania" (X)
- Responsywność: desktop (side-by-side), mobile (vertical stack)
- Przycisk "Dodaj kolejnego"
- Zamknięcie czyści wybór

#### US-018: Statystyki Drużyn
ID: US-018
Tytuł: Przeglądanie form i terminarzy drużyn
Opis: Jako użytkownik, chcę wiedzieć który team ma łatwy terminarz.
Kryteria Akceptacji:
- Zakładka "Drużyny" w nawigacji
- Lista 18 drużyn PKO BP Ekstraklasa
- Każda karta drużyny:
  * Nazwa (logo jeśli dostępne)
  * Pozycja w tabeli: "3. miejsce"
  * Forma ostatnie 3: W-W-R (kolorowanie)
  * Następne 3 mecze: Przeciwnik (H/A), Trudność (badge), Data
- Kliknięcie karty rozwija:
  * Pełny terminarz
  * Lista zawodników (link do filtra)
  * Średnia pkt Fantasy zawodników
  * Stats ofensywne/defensywne
- Sortowanie: Po pozycji (default), Po formie, Po trudności meczów
- Trudność: Łatwy (13-18), Średni (7-12), Trudny (1-6 miejsce)
- Przycisk "Pokaż zawodników" filtruje główną tabelę
- Kolor border karty według formy: zielony (3W), żółty (mix), czerwony (3P)

### 5.5 Generowanie Składów

#### US-019: Wybór Formacji
ID: US-019
Tytuł: Wybór taktycznego ustawienia przed generowaniem
Opis: Jako użytkownik z preferencjami taktycznymi, chcę wybrać formację dla mojego składu.
Kryteria Akceptacji:
- Strona "Generuj skład" z sekcją "Wybierz formację"
- 7 opcji formacji jako klikalne karty:
  * 1-4-4-2 (domyślna, zaznaczona)
  * 1-4-3-3, 1-4-5-1, 1-5-3-2, 1-5-4-1, 1-3-5-2, 1-3-4-3
- Każda karta pokazuje:
  * Mini boisko z kropkami/ikonami
  * Tekst "1-4-4-2"
  * Radio button
- Wybrana: border + background highlight
- Hover: tooltip z opisem "Zbalansowana, dobra uniwersalnie"
- Info: "2 bramkarzy, 5 obrońców, 5 pomocników, 3 napastników"
- Wybór wymagany przed generowaniem
- Zapisywany jako default preferencja użytkownika

#### US-020: Blokowanie Zawodników
ID: US-020
Tytuł: Gwarantowanie wybranych zawodników w składzie
Opis: Jako użytkownik z ulubieńcami, chcę zablokować 3-5 zawodników.
Kryteria Akceptacji:
- Sekcja "Zablokuj zawodników (opcjonalnie)"
- Info: "Do 5 zawodników, którzy muszą być w składzie"
- 5 slotów z "+ Dodaj zawodnika"
- Kliknięcie otwiera modal z autocomplete:
  * Live search po nazwisku
  * Wyświetla: Nazwisko | Drużyna | Pozycja | Cena | Forma
  * Tabs filtrowania: Wszyscy, GK, DEF, MID, FWD
- Po wyborze:
  * Slot wypełniony: Nazwisko + mini ikona pozycji + cena + X (usuń)
  * Zawodnik znika z listy (no duplicates)
- Licznik: "3/5 zablokowanych"
- Walidacja real-time:
  * Ostrzeżenie jeśli suma cen zbyt wysoka: "⚠️ Zablokowani: 22M. Pozostało 8M na 10 zawodników"
  * Błąd jeśli > max 3 z drużyny: "❌ Już 3 z Legii. Wybierz z innej drużyny"
  * Błąd jeśli niezgodność z formacją: "❌ 5 obrońców zablokowanych ale formacja wymaga 4"
- Przycisk "Wyczyść wszystkich"
- Persistent w sesji

#### US-021: Generowanie Składu AI
ID: US-021
Tytuł: Wygenerowanie zoptymalizowanego składu przez AI
Opis: Jako użytkownik, chcę aby AI szybko utworzyło optymalny skład.
Kryteria Akceptacji:
- Duży przycisk "Generuj skład AI" (CTA)
- Disabled jeśli: brak formacji, błędy walidacji zablokowanych
- Kliknięcie:
  * Disable przycisku (prevent double-click)
  * Loading overlay z animacją + progress messages:
    - "Generuję skład..." (0-30%)
    - "Analizuję statystyki..." (30-70%)
    - "Optymalizuję budżet..." (70-100%)
  * Spinner lub progress bar
- Backend → Openrouter.ai API call z:
  * Wszystkie statystyki (JSON)
  * Formacja, zablokowani, system wagowy, ograniczenia
  * Wybór modelu AI (Claude 3.5 Sonnet domyślnie, fallback na GPT-4)
- Timeout 30s (potem error message)
- Generowanie: typowo 10-30s
- Po sukcesie, wyświetlenie składu:
  * **Wizualizacja boiska**: 11 podstawowych według formacji + 4 rezerwowych poniżej
  * Każdy zawodnik: Nazwisko, Drużyna, Pozycja, Cena, Forma
  * Badge (C) kapitan, (VC) vice-kapitan
  * Ikona 🔒 dla zablokowanych
- **Podsumowanie**:
  * "Koszt: 28.5M / 30M (1.5M pozostało)"
  * Progress bar budżetu
  * "Formacja: 1-4-4-2"
  * "Wygenerowano w 18s"
- **Sugestia bonusu**:
  * Badge bonusu (np. "Kapitanów 2")
  * Uzasadnienie: "2 zawodników z wysoką formą (>8) + łatwe mecze = ~15-20 pkt extra"
  * Przycisk "Zobacz podgląd"
- **Kandydaci na Jokera** (jeśli są):
  * 2-3 zawodników ≤2.0M z najwyższą formą
  * Badge "⭐ Joker Candidate"
- **Przyciski akcji**:
  * "Zapisz skład" (primary)
  * "Modyfikuj" (secondary → tryb edycji)
  * "Generuj ponownie" (same params)
  * "Zmień parametry" (back to setup)
- Tracking: Log (user_id, lineup, timestamp, generation_time)

#### US-022: Wyjaśnienie Strategii
ID: US-022
Tytuł: Zrozumienie logiki AI
Opis: Jako użytkownik, chcę wiedzieć jak AI podjęło decyzje.
Kryteria Akceptacji:
- Expandable accordion "Jak wygenerowano skład?"
- Wyświetla:
  * Strategia: "Zbalansowana"
  * Opis: "Równowaga formy, punktów i budżetu"
  * System wagowy (progress bars):
    - Forma: 40% [████████░░]
    - Punkty Fantasy: 30% [██████░░░░]
    - Budżet: 20% [████░░░░░░]
    - Forma drużyny: 10% [██░░░░░░░░]
  * Blocking factors: "Tylko Pewny start lub Wątpliwy (priorytet Pewny)"
  * Czas: "18 sekund"
- Tooltip (?) przy zawodnikach: hover → "Lewandowski (forma 9.2, łatwe mecze, 125 pkt)"
- Link "Dowiedz się więcej" → help page

#### US-023: Zmiana Formacji Po Generowaniu
ID: US-023
Tytuł: Reorganizacja składu pod nową formację
Opis: Jako użytkownik, chcę przetestować inną formację bez re-generowania.
Kryteria Akceptacji:
- Selektor formacji aktywny po wygenerowaniu
- Info: "Zmień ustawienie poniżej"
- Po wyborze nowej:
  * Walidacja czy możliwa z obecnymi zawodnikami
  * Jeśli TAK: Auto-reorganizacja (1-2s loading)
    - Nadmiar → ławka (priorytet: najgorsza forma)
    - Braki → z ławki (priorytet: najlepsza forma)
  * Jeśli NIE: Error "❌ Nie można: brak wystarczających obrońców. Masz 4, wymaga 5"
    - Sugestia: "Generuj nowy lub dodaj ręcznie"
- Po sukcesie:
  * Animacja przemieszczenia zawodników
  * Toast "✅ Zmieniono na 1-5-3-2"
  * Update wizualizacji
- Przycisk "Cofnij" (back to previous)
- Historia ostatnich 3 formacji

#### US-024: Podgląd Kapitanów 2
ID: US-024
Tytuł: Symulacja bonusu Kapitanów 2
Opis: Jako użytkownik, chcę zobaczyć potencjał tego bonusu.
Kryteria Akceptacji:
- Przycisk "Zobacz podgląd Kapitanów 2" (jeśli bonus dostępny)
- Modal split-screen:
  * Lewa: skład obecny
  * Prawa: skład z Kapitanami 2
- AI wybiera 2 najlepszych (forma + terminarz + pewność gry)
- Oba oznaczone (C1) i (C2)
- Dla każdego prognoza: "8 pkt → 16 pkt (x2)" + zielona strzałka
- Suma: "Bez: 55 | Z bonusem: 71 (+16)"
- Progress bars wizualizujące
- Ręczna zmiana kapitanów: dropdowny z 11 podstawowych
- Real-time update prognoz
- Uzasadnienie: "Lewandowski (forma 9.2, mecz z ostatnim, 95% pewność)"
- Ostrzeżenie: "Jeśli nie zagra, stracisz podwójne punkty"
- Przyciski: "Aktywuj bonus", "Zapisz bez", "Anuluj"
- Disclaimer: "To prognoza, rzeczywiste mogą się różnić"

#### US-025: Modyfikacja Składu
ID: US-025
Tytuł: Ręczna edycja wygenerowanego składu
Opis: Jako użytkownik, chcę dostosować skład do własnych przekonań.
Kryteria Akceptacji:
- Przycisk "Modyfikuj" → tryb edycji
- Każda pozycja zawodnika: ikona ✏️ lub click całej karty
- Hover: podświetlenie + cursor pointer
- Kliknięcie otwiera modal "Zmień zawodnika":
  * Obecny zawodnik (highlight)
  * Lista alternatyw (ta sama pozycja)
  * Sort: domyślnie po formie
  * Dla każdego: Nazwisko, Drużyna, Cena, Forma, Pkt, Różnica ceny ("+0.5M" czerwony / "-0.3M" zielony)
- Panel "Wpływ na budżet":
  * Obecny: 28.5M/30M
  * Po wyborze: 29.0M/30M (1.0M left) - real-time
  * Ostrzeżenie jeśli over budget (czerwony + disabled confirm)
- Walidacja:
  * Max 3 z drużyny
  * Budżet
- Kliknięcie zawodnika: preview + "Potwierdź zmianę"
- Po potwierdzeniu:
  * Zamknięcie modal
  * Animacja swap
  * Toast "✅ Zmieniono [Old] → [New]"
  * Update budżetu/stats
- Badge "2 zmiany względem AI"
- Status: "AI + Edytowany"
- Przycisk "Cofnij" (undo max 10)
- Przycisk "Przywróć AI" (reset)
- Tracking każdej zmiany

#### US-026: Zmiana Kapitanów
ID: US-026
Tytuł: Nadpisanie wyboru kapitanów AI
Opis: Jako użytkownik, chcę samodzielnie wybrać kapitanów.
Kryteria Akceptacji:
- Kapitan (C) niebieski badge, Vice (VC) szary badge
- Kliknięcie zawodnika (11 podstawowych) → menu kontekstowe:
  * "Ustaw jako kapitana"
  * "Ustaw jako vice-kapitana"
  * "Edytuj zawodnika"
- "Ustaw jako kapitana":
  * Poprzedni traci (C)
  * Nowy dostaje (C)
  * Jeśli był VC, system pyta o nowego VC
  * Toast "✅ [Nazwisko] kapitanem"
- "Ustaw jako vice":
  * Poprzedni traci (VC)
  * Nowy dostaje (VC)
  * Toast "✅ [Nazwisko] vice-kapitanem"
- Walidacja: różni zawodnicy
- Tooltip: (C) "Punkty x2", (VC) "Punkty x2 jeśli kapitan nie zagra"
- Alternative UI: Dropdowny poniżej składu
- Bez wpływu na budżet
- Tracking: zmiana kapitanów

### 5.6 Zarządzanie Składami

#### US-027: Zapisanie Składu
ID: US-027
Tytuł: Zachowanie składu do późniejszego użycia
Opis: Jako użytkownik, chcę zapisać skład aby go nie stracić.
Kryteria Akceptacji:
- Przycisk "Zapisz skład" (primary CTA)
- Modal "Zapisz skład":
  * Pole "Nazwa": placeholder "np. Kolejka 15 - Mocna forma", max 50 znaków
  * Default: "Skład [data]"
  * Preview: mini boisko z nazwiskami
  * Podsumowanie: Formacja, Budżet, Modyfikacje vs AI
  * Checkbox "Aktywny wariant" (default checked)
- Info: "Zapisane: 2/3"
- Jeśli 3/3:
  * "Limit osiągnięty. Usuń jeden lub nadpisz"
  * Lista 3 składów z "Usuń"
  * Dropdown "Nadpisz istniejący:"
- Przycisk "Zapisz"
- Po zapisie:
  * Toast "✅ Skład zapisany"
  * Zapis w DB (user_id, lineup_data, name, timestamp, is_active)
  * Redirect lub zamknięcie modal
- Dostęp z menu "Moje składy"

#### US-028: Przeglądanie Zapisanych Składów
ID: US-028
Tytuł: Dostęp do wszystkich wariantów
Opis: Jako użytkownik, chcę zobaczyć zapisane opcje składów.
Kryteria Akceptacji:
- Strona "Moje składy" w nawigacji
- Lista max 3 składów jako karty:
  * Nazwa składu (edytowalna inline)
  * Data utworzenia/modyfikacji
  * Formacja
  * Budżet wykorzystany
  * Badge "Aktywny" (jeśli is_active)
  * Preview: mini lineup grid
- Każda karta:
  * "Zobacz szczegóły" (expand/modal)
  * "Edytuj"
  * "Usuń" (z confirmacją)
  * "Kopiuj" (duplikuje jako nowy)
- Sort: ostatnio modyfikowane najpierw
- Empty state: "Nie masz jeszcze składów. Wygeneruj pierwszy!"

#### US-029: Edycja Zapisanego Składu
ID: US-029
Tytuł: Modyfikacja istniejącego składu
Opis: Jako użytkownik, chcę poprawić zapisany skład.
Kryteria Akceptacji:
- "Edytuj" otwiera skład w trybie edycji (jak US-025)
- Wszystkie funkcje modyfikacji dostępne
- Walidacja ograniczeń
- "Zapisz zmiany" nadpisuje oryginał
- "Zapisz jako nowy" tworzy kopię (jeśli <3)
- "Anuluj" bez zapisywania
- Timestamp "Ostatnia modyfikacja" aktualizowany
- Tracking: historia edycji

#### US-030: Usunięcie Składu
ID: US-030
Tytuł: Usunięcie niepotrzebnego wariantu
Opis: Jako użytkownik, chcę zwolnić slot dla nowego składu.
Kryteria Akceptacji:
- Przycisk "Usuń" na karcie składu
- Dialog: "Czy na pewno usunąć '[Nazwa]'? Nie można cofnąć"
- Przyciski: "Usuń" (czerwony) / "Anuluj"
- Po potwierdzeniu:
  * Usunięcie z DB
  * Toast "Skład usunięty"
  * Aktualizacja listy
- Historyczne dane zachowane dla analytics (soft delete)

#### US-031: Kopiowanie Składu do Schowka
ID: US-031
Tytuł: Eksport składu jako tekst
Opis: Jako użytkownik, chcę skopiować skład do innego narzędzia.
Kryteria Akceptacji:
- Przycisk "Kopiuj do schowka" (📋 icon)
- Format tekstowy:
```
SKŁAD - [Nazwa] (1-4-4-2)
PODSTAWOWI:
GK: Jan Kowalski (Legia)
DEF: ... (4 obrońców)
MID: ... (4 pomocników)
FWD: ... (2 napastników)
Kapitan: [Nazwisko] (C)
Vice: [Nazwisko] (VC)
REZERWOWI:
...
Budżet: 28.5M / 30M
```
- Toast "✅ Skopiowano do schowka"
- Możliwość paste wszędzie

### 5.7 Bonusy

#### US-032: Panel Statusu Bonusów
ID: US-032
Tytuł: Przegląd dostępnych bonusów
Opis: Jako użytkownik, chcę wiedzieć które bonusy mogę użyć.
Kryteria Akceptacji:
- Sticky panel "Bonusy" w dashboardzie/stronie składu
- 3 karty bonusów:
  * **Ławka punktuje**: Status (Dostępny/Użyty w kolejce X)
  * **Kapitanów 2**: Status
  * **Joker**: Status
- Każda karta:
  * Nazwa + ikona
  * Status badge (zielony "Dostępny" / szary "Użyty")
  * Jeśli użyty: "Kolejka X"
  * Tooltip z opisem
- AI sugestia (jeśli dostępne):
  * "💡 Sugerujemy: Kapitanów 2"
  * Krótkie uzasadnienie
  * Link "Zobacz więcej"
- Update automatyczny po każdej kolejce
- Info: "Bonusy resetują się co rundę (pół sezonu)"

#### US-033: Aktywacja Bonusu
ID: US-033
Tytuł: Użycie bonusu dla kolejki
Opis: Jako użytkownik, chcę aktywować bonus przed zapisaniem składu.
Kryteria Akceptacji:
- Podczas zapisywania składu (US-027):
  * Sekcja "Bonus dla tej kolejki"
  * Radio buttons: Brak / Ławka punktuje / Kapitanów 2 / Joker
  * Tylko dostępne bonusy enabled
- Wybór bonusu:
  * Preview wpływu (jeśli możliwy do obliczenia)
  * Tooltip wyjaśniający działanie
- Confirmation dialog:
  * "Aktywujesz [Bonus]. Użyjesz go tylko raz w rundzie. Kontynuować?"
  * "Tak, aktywuj" / "Anuluj"
- Po zapisie:
  * Bonus marked as used w DB
  * Panel aktualizowany
  * Toast "✅ Bonus [Nazwa] aktywowany"
- Nie można zmienić po zapisie (wymaga nowego składu)

### 5.8 Transfer Tips

#### US-034: Wyświetlenie Rekomendacji
ID: US-034
Tytuł: AI sugeruje korzystne transfery
Opis: Jako użytkownik, chcę wiedzieć kogo wymienić aby poprawić skład.
Kryteria Akceptacji:
- Strona "Transfer Tips" w menu
- 3-5 rekomendowanych transferów jako karty
- Każda karta split:
  * **Lewa (OUT)**: Zawodnik do wymiany
    - Nazwisko, Drużyna, Pozycja, Cena
    - Powód: "Forma spada (2 kolejki po 1 pkt)", "Trudny terminarz", "Kontuzja"
    - Ostatnia forma: wykres mini
  * **Prawa (IN)**: Zawodnik na zastąpienie
    - Nazwisko, Drużyna, Pozycja, Cena
    - Powód: "Wysoka forma (8, 11 pkt)", "Łatwy terminarz", "Dobra cena"
    - Forma: wykres mini
  * **Środek**: Różnica ceny "+0.1M" / "-0.2M" / "=0M"
- Przycisk "Porównaj" → side-by-side (jak US-017)
- Przycisk "Zastosuj" → otwiera skład z automatyczną wymianą (wymaga potwierdzenia)
- Przycisk "Odrzuć" (X) ukrywa sugestię
- Update po każdej kolejce
- Jeśli brak rekomendacji: "Twój skład wygląda dobrze! Wróć po kolejce"

#### US-035: Zastosowanie Transferu
ID: US-035
Tytuł: Szybkie wykonanie sugerowanej wymiany
Opis: Jako użytkownik, chcę łatwo zastosować dobrą sugestię.
Kryteria Akceptacji:
- "Zastosuj" na karcie transferu
- Modal confirmation:
  * Stary → Nowy (wizualizacja)
  * Wpływ na budżet
  * "Potwierdź transfer" / "Anuluj"
- Po potwierdzeniu:
  * Otwarcie zapisanego aktywnego składu w trybie edycji
  * Auto-wymiana zawodników
  * Możliwość dalszych modyfikacji
  * "Zapisz zmiany" lub "Anuluj transfer"
- Tracking: applied transfers

### 5.9 Historia i Analytics

#### US-036: Automatyczne Pobieranie Wyników
ID: US-036
Tytuł: System aktualizuje punkty po kolejce
Opis: Jako użytkownik, chcę aby wyniki były dostępne automatycznie.
Kryteria Akceptacji:
- Scheduled job dzień po kolejce:
  * Scraping wyników z fantasy.ekstraklasa.org
  * Parsowanie punktów per zawodnik
  * Zapis w DB
- Dla każdego użytkownika z aktywnym składem:
  * Obliczenie total punktów (z bonusami):
    - Kapitan x2
    - Vice x2 (jeśli kapitan 0 minut)
    - Bonus multipliers
  * Zapis w lineup_results (lineup_id, points, matchweek)
- Notification (opcjonalnie): "Wyniki kolejki X dostępne!"
- Wyniki widoczne w historii

#### US-037: Historia Składów
ID: US-037
Tytuł: Przegląd poprzednich kolejek
Opis: Jako użytkownik, chcę zobaczyć jak radziłem sobie w przeszłości.
Kryteria Akceptacji:
- Strona "Historia" w menu
- Lista ostatnich 10+ kolejek (tabela/karty)
- Każda kolejka:
  * Numer: "Kolejka 15"
  * Data
  * Punkty: "67 pkt"
  * Bonus użyty: Badge
  * Status: "AI" lub "AI + Edytowany"
  * Przycisk "Szczegóły"
- "Szczegóły" otwiera modal/strona:
  * **Skład AI**: Wygenerowany lineup
  * **Mój skład**: Finalny (po modyfikacjach)
  * Highlight różnic (żółty background)
  * Punkty per zawodnik
  * Bonus i jego wpływ
  * Total: AI points vs My points
- Sort: najnowsze najpierw
- Filtrowanie: Wszystkie / Tylko AI / Edytowane

#### US-038: Porównanie AI vs Użytkownik
ID: US-038
Tytuł: Analiza skuteczności moich decyzji
Opis: Jako użytkownik, chcę wiedzieć czy moje modyfikacje pomagają.
Kryteria Akceptacji:
- Sekcja "Twoja skuteczność" na stronie historia
- Stats:
  * **Wskaźnik akceptacji AI**: "75% (15/20 składów bez modyfikacji)"
  * **Średnia punktów AI**: "58 pkt"
  * **Średnia punktów Finalna**: "62 pkt"
  * **Różnica**: "+4 pkt (lepiej niż AI)" zielony lub "-2 pkt" czerwony
- Wykres liniowy: punkty w czasie (AI vs User)
- Breakdown modyfikacji:
  * "Najczęściej zmieniany: Napastnicy (8 razy)"
  * "Najbardziej opłacalna zmiana: Kolejka 12 (+15 pkt)"
- Insight: "Twoje modyfikacje poprawiają skład średnio o 4 pkt"

#### US-039: Wskaźniki Sukcesu AI
ID: US-039
Tytuł: Weryfikacja czy AI spełnia cele produktu
Opis: Jako użytkownik, chcę wiedzieć jak dobrze działa AI.
Kryteria Akceptacji:
- Dashboard sekcja "Wydajność AI"
- Metryki:
  * **% składów z 50+ pkt**: "80% (16/20)" - progress bar
  * **Średnia punktów**: "58 pkt"
  * **% składów top 10% ligi**: "5%" (jeśli dane dostępne)
- Porównanie z ligą: "AI lepsze niż średnia ligowa (52 pkt)"
- Trend: "Poprawia się! +3 pkt avg ostatnie 5 kolejek"

### 5.10 Admin i Monitoring

#### US-040: Dashboard Admina
ID: US-040
Tytuł: Monitoring zdrowia systemu
Opis: Jako admin, chcę monitorować jakość danych i wydajność.
Kryteria Akceptacji:
- Strona "/admin" (tylko authorized users)
- Sekcje:
  1. **Jakość danych**:
     - Świeżość: timestamp + status (zielony/żółty/czerwony)
     - Kompletność: "95% zawodników z pełnymi danymi"
     - Sukces scrapingu: "98% (295/300 prób)"
     - Ostatni scraping: timestamp + status
  2. **Użytkownicy**:
     - Zarejestrowani: liczba
     - Aktywni (MAU): liczba
     - Nowi (7 dni): liczba
     - Retencja: % + wykres
  3. **AI Performance**:
     - Akceptacja: % + progress bar (cel 75%)
     - Sukces punktowy: % + progress bar (cel 75%)
     - Średnia punktów: AI vs Users
     - Failures: liczba + ostatnie
  4. **System**:
     - API usage: calls, cost
     - Response times: avg, p95, p99
     - Error rate: %
     - Uptime: %
- Refresh co 5 minut (auto)
- Przyciski: "Wymuś scraping", "Wyczyść cache", "Export logs"

#### US-041: Alerty o Błędach
ID: US-041
Tytuł: Powiadomienia o krytycznych problemach
Opis: Jako admin, chcę wiedzieć gdy coś się psuje.
Kryteria Akceptacji:
- Email alerts trigger when:
  * Scraping fails 3x (wszystkie retry wyczerpane)
  * Data stale >24h
  * Error rate >5%
  * API budget przekroczony 80%
- Email zawiera:
  * Tytuł problemu
  * Timestamp
  * Szczegóły (stack trace jeśli applicable)
  * Link do admin dashboard
- Alert frequency: max 1 email/problem/hour (no spam)
- Admin może configure alert thresholds

## 6. Metryki Sukcesu

### 6.1 Podstawowe (Must-Achieve)
- **Akceptacja AI: 75%** (składy z 0-2 modyfikacjami / wszystkie) - Timeline: M5+
- **Sukces punktowy: 75%** (składy AI ≥50pkt / użyte) - Timeline: M5+
- **Świeżość: 100%** (dane ≤24h od kolejki)
- **Stabilność: <1%** (błędy / akcje użytkownika)

### 6.2 Drugorzędne
- 100 rejestracji w 3M
- 50 MAU
- 40% retencja (1 tydzień)
- 95% kompletność danych
- 98% sukces scrapingu

### 6.3 Trzeciorzędne
- Czas do 1. składu: ≤5 min
- Tutorial completion: 60%
- Użycie porównań: 80%
- Ładowanie: ≤2s
- Generowanie: ≤30s (95%)

## 7. Harmonogram MVP

### Październik (M1): Foundation
- W1-2: Astro + Supabase setup, Auth, Database schema, Scraping prototype (Node.js/Python)
- W3-4: Scraping implementation, Import do DB, UI tabel statystyk

### Listopad (M2): Core Features
- W1-2: Openrouter.ai integration, Prompt engineering, UI generowania, System bonusów
- W3-4: User management, Zapisywanie składów, Tutorial, Transfer tips

### Grudzień (M3): Polish & Launch
- W1: Porównania, Historia, Analytics dashboard
- W2: Testing, Bug fixes, Performance optimization, Mobile responsiveness
- W3: Landing page, Privacy Policy + ToS, Beta testing (5-10 osób)
- W4: Deployment, Soft launch, Monitoring

### Styczeń 2026: Launch
Runda wiosenna - pierwsi użytkownicy

## 8. Ryzyka i Mitygacje

### Wysokie
1. **Scraping** - Mitygacja: Manual import backup, kontakt z Ekstraklasą, Node.js/Python dla lepszej integracji
2. **Openrouter.ai koszty/jakość** - Mitygacja: Prosty algorytm fallback, optymalizacja promptu, fallback na GPT-4
3. **Brak użytkowników** - Mitygacja: Marketing w społecznościach Fantasy, influencerzy

### Średnie
1. **Solo developer** - Mitygacja: MVP minimum, +20-30% buffer time
2. **Performance** - Mitygacja: Caching, optymalizacja post-MVP
3. **Konkurencja** - Mitygacja: AI differentiator, szybki time-to-market

## 9. Rekomendacje Technologii z Ekosystemu

### 9.1 Alternatywy do Rozważenia

**Frontend Framework:**
- **Next.js 14** - Jeśli zespół bardziej zna React ecosystem
- **SvelteKit** - Lżejsze rozwiązanie, szybsze ładowanie
- **Remix** - Lepsze dla aplikacji z dużą ilością formularzy

**Styling:**
- **CSS Modules** - Prostsze niż Tailwind dla MVP
- **Styled Components** - Jeśli preferujesz CSS-in-JS
- **UnoCSS** - Szybsza alternatywa dla Tailwind

**Backend/Database:**
- **PlanetScale** - MySQL z branching, lepsze dla większych aplikacji
- **Vercel Postgres** - Jeśli już używasz Vercel
- **Railway** - Prostsze deployment niż DigitalOcean

**AI/ML:**
- **Anthropic Claude API** - Bezpośrednio, bez Openrouter
- **OpenAI API** - Bezpośrednio, sprawdzone rozwiązanie
- **Groq** - Bardzo szybkie inference, dobre dla real-time

**Monitoring/Analytics:**
- **PostHog** - Kompletne product analytics
- **Mixpanel** - Event tracking
- **LogRocket** - Session replay + error tracking

### 9.2 Rekomendowane Kombinacje

**Opcja A - Minimalna (MVP):**
- Next.js + CSS Modules + Supabase + OpenAI API + Vercel

**Opcja B - Zbalansowana (obecna):**
- Astro + Tailwind + Supabase + Openrouter.ai + DigitalOcean

**Opcja C - Enterprise:**
- Next.js + Styled Components + PlanetScale + Anthropic + AWS

## 10. Otwarte Pytania

### Priorytet 1 (Krytyczne - przed startem)
- Zbadać scraping fantasy.ekstraklasa.org (prototyp w Node.js/Python działa?)
- Przeczytać regulamin (scraping dozwolony?)
- Przetestować Openrouter.ai z prawdziwymi danymi (koszt? jakość? Claude vs GPT?)
- Database schema (zaprojektować w Supabase)

### Priorytet 2 (Ważne - przed implementacją)
- Wireframes kluczowych ekranów
- Privacy Policy + ToS (RODO compliance)
- Analytics setup
- Plan marketingowy (gdzie znaleźć użytkowników?)

### Priorytet 3 (Nice-to-have)
- Research konkurencji
- Landing page content
- Beta tester list (5-10 osób)

## 11. Kontrola Dokumentu

- **Wersja**: 1.1 (Zaktualizowana)
- **Data**: Październik 2025
- **Status**: Zatwierdzony do Developmentu
- **Zmiany**: Openrouter.ai, Node.js/Python scraping, rekomendacje technologii
- **Następny przegląd**: Miesięcznie podczas developmentu

Dokument aktualizowany gdy:
- Odkrycia techniczne
- Feedback użytkowników
- Zmiany rynkowe
- Ewolucja wymagań