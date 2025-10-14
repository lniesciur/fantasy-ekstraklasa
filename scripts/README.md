# Skrypty deweloperskie

## generate-test-excel.js

Skrypt do generowania przykładowego pliku Excel z danymi graczy Fantasy Ekstraklasa na potrzeby testowania API importu.

### Uruchomienie

```bash
npm run generate-test-excel
```

lub

```bash
node scripts/generate-test-excel.js
```

### Co generuje

Skrypt tworzy plik `test-import.xlsx` w głównym katalogu projektu zawierający:

- **50 przykładowych graczy** z realistycznymi danymi
- **Wszystkie wymagane kolumny** zgodne z `ImportPlayerRow` interface:
  - `name` - Imię i nazwisko gracza
  - `team` - Nazwa drużyny z Ekstraklasy
  - `position` - Pozycja (GK, DEF, MID, FWD)
  - `price` - Cena w Fantasy (3M - 15M)
  - `health_status` - Status zdrowia (Pewny/Wątpliwy/Nie zagra)
  - `fantasy_points` - Punkty Fantasy
  - `goals` - Bramki
  - `assists` - Asysty
  - `lotto_assists` - Specjalne asysty dla lotto
  - `penalties_scored` - Wykonane rzuty karne
  - `penalties_caused` - Wywołane rzuty karne
  - `penalties_missed` - Chybione rzuty karne
  - `yellow_cards` - Żółte kartki
  - `red_cards` - Czerwone kartki
  - `minutes_played` - Rozegrane minuty
  - `in_team_of_week` - Czy w drużynie tygodnia
  - `predicted_start` - Przewidywane wyjście w pierwszym składzie

### Dane testowe

- **Drużyny**: Wszystkie 18 drużyn Ekstraklasy
- **Pozycje**: Rozkład ~25% GK, ~25% DEF, ~30% MID, ~20% FWD
- **Statystyki**: Realistyczne wartości bazujące na pozycji gracza
- **Nazwy graczy**: Kombinacja prawdziwych nazw polskich piłkarzy

### Użycie w testach

Po wygenerowaniu pliku możesz go użyć do testowania endpointu `/api/data/import/validate`:

```bash
# Uruchom serwer deweloperski
npm run dev

# W Postmanie lub curl:
# POST http://localhost:4321/api/data/import/validate
# Content-Type: multipart/form-data
# file: test-import.xlsx
```

### Dostosowanie

Możesz modyfikować skrypt żeby zmienić:
- Liczbę generowanych graczy
- Zakres wartości statystyk
- Rozkład pozycji
- Dodatkowe drużyny lub nazwiska
