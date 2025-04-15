# Dokument wymagań produktu (PRD) - Board Game Collection Manager

## 1. Przegląd produktu
Board Game Collection Manager to aplikacja umożliwiająca zarządzanie rosnącą kolekcją gier planszowych. Celem aplikacji jest eliminacja chaosu informacyjnego związanego z posiadaniem i zarządzaniem wieloma tytułami gier planszowych, ułatwiając podejmowanie decyzji zakupowych oraz zapewniając intuicyjny interfejs użytkownika. Projekt zakłada wdrożenie systemu autentykacji użytkowników, operacji CRUD na kolekcji gier oraz modułu rekomendacji opartych na analizie posiadanych gier.

## 2. Problem użytkownika
Miłośnicy gier planszowych często mają trudności z:
- Zachowaniem porządku w rosnącej kolekcji gier.
- Szybkim wyszukiwaniem konkretnych tytułów w rozbudowanej kolekcji.
- Podejmowaniem świadomych decyzji dotyczących zakupów nowych gier.
- Utrzymaniem bezpieczeństwa swoich danych i ograniczonym dostępem do systemu.

Aplikacja oferuje rozwiązania, które:
- Umożliwiają kompleksowe zarządzanie kolekcją gier z wykorzystaniem operacji CRUD.
- Zapewniają bezpieczny dostęp dzięki systemowi rejestracji i logowania.
- Umożliwiają filtrowanie, sortowanie i wyszukiwanie gier.
- Dostarczają rekomendacji gier na podstawie analizy istniejących danych w kolekcji uzytkownika.

## 3. Wymagania funkcjonalne
Aplikacja musi zawierać następujące kluczowe funkcjonalności:
1. System autentykacji użytkowników:
   - Rejestracja, logowanie oraz zabezpieczone endpointy.
   - Bezpieczny dostęp tylko dla zweryfikowanych użytkowników.
2. Operacje CRUD na kolekcji gier:
   - Dodawanie gry z informacjami: tytuł, wydawca, kategorie, mechaniki, liczba graczy, czas rozgrywki.
   - Edycja i usuwanie istniejących wpisów.
3. Obsługa duplikatów i rozszerzeń:
   - Dodawanie gier o tym samym tytule w różnych wydaniach lub jako rozszerzenia z dodatkowymi metadanymi.
4. Zarządzanie lokalizacją gier:
   - Predefiniowane kategorie lokalizacji (np. "półka", "regał", "karton") oraz możliwość dodawania własnych kategorii.
5. Interfejs wyszukiwania:
   - Wyszukiwanie gier według tytułu i atrybutów, z dodatkowymi filtrami (np. gry do grania z dzieckiem, kryteria wiekowe, poziom trudności, język wydania, czas rozgrywki).
6. Moduł rekomendacji:
   - Prosty algorytm rekomendacji oparty na analizie kategorii i mechanik posiadanych gier.
7. Formularz oceny satysfakcji:
   - System oceny w formie gwiazdek i komentarzy, wyświetlany po osiągnięciu określonych progów, bez możliwości późniejszej edycji.
8. Monitorowanie aktywności:
   - Rejestrowanie logowań oraz interakcji użytkowników.

## 4. Granice produktu
Zakres MVP obejmuje:
- Podstawowy system uwierzytelniania oraz operacje CRUD na kolekcji gier.
- Dodawanie, edycję, usuwanie, filtrowanie i sortowanie wpisów.
- System rekomendacji oparty na prostych regułach.
- Interfejs użytkownika umożliwiający zarządzanie kolekcją minimum 50 gier.
- Dodawanie duplikatów oraz rozszerzeń gier z pełnym opisem metadanych.
- Monitorowanie logowań oraz kluczowych interakcji.

Funkcje poza MVP:
- Integracja z zewnętrznymi API (np. BoardGameGeek).
- Rozbudowane funkcje społecznościowe i statystyki.
- Mobilna wersja aplikacji.

## 5. Historyjki użytkowników
US-001
Tytuł: Rejestracja i logowanie
Opis: Użytkownik tworzy konto i loguje się do aplikacji w celu uzyskania dostępu do funkcji zarządzania kolekcją.
Kryteria akceptacji:
- Możliwość rejestracji za pomocą adresu email, loginu i hasła.
- Możliwość logowania z weryfikacją poprawności danych.
- Dostęp do zabezpieczonych funkcji po zalogowaniu.

US-002
Tytuł: Przeglądanie kolekcji gier
Opis: Użytkownik przegląda listę dodanych gier z możliwością filtrowania i sortowania.
Kryteria akceptacji:
- Gry są wyświetlane w formie listy lub siatki.
- Dostępne filtry obejmują kategorie, liczbę graczy i czas rozgrywki.
- Wyniki sortowane są według wybranego kryterium, np. alfabetycznie lub według daty dodania.

US-003
Tytuł: Dodawanie gry do kolekcji
Opis: Użytkownik dodaje nową grę, podając wszystkie wymagane informacje.
Kryteria akceptacji:
- Formularz umożliwia wprowadzenie danych: tytuł, wydawca, kategorie, mechaniki, liczba graczy, czas rozgrywki.
- Walidacja danych w czasie rzeczywistym.
- Potwierdzenie udanej operacji dodania gry.

US-004
Tytuł: Edycja informacji o grze
Opis: Użytkownik modyfikuje dane dotyczące gry już dodanej do kolekcji.
Kryteria akceptacji:
- Formularz edycji umożliwia modyfikację wszystkich kluczowych danych.
- Zmiany są zatwierdzane i zapisywane po walidacji.
- Użytkownik otrzymuje potwierdzenie o udanej edycji.

US-005
Tytuł: Usuwanie gry z kolekcji
Opis: Użytkownik usuwa wybraną grę z kolekcji.
Kryteria akceptacji:
- Akcja usunięcia wymaga potwierdzenia.
- Po usunięciu, gra przestaje być widoczna w kolekcji.
- Możliwość cofnięcia operacji (opcjonalnie).

US-006
Tytuł: Dodawanie duplikatów i rozszerzeń gier
Opis: Użytkownik może dodawać gry o tym samym tytule jako duplikaty lub rozszerzenia, z dodatkowymi metadanymi.
Kryteria akceptacji:
- Formularz dodawania umożliwia wskazanie, czy gra jest duplikatem lub rozszerzeniem.
- Możliwość dodania dodatkowych opisów różnic między wersjami.
- Nowy wpis jest poprawnie powiązany z odpowiednim wpisem bazowym (dla rozszerzeń).

US-007
Tytuł: Wyszukiwanie gier
Opis: Użytkownik wyszukuje gry w kolekcji za pomocą wyspecjalizowanych filtrów.
Kryteria akceptacji:
- Wyszukiwanie działa na podstawie tytułu i atrybutów gry.
- Dodatkowe filtry obejmują wiek dziecka, poziom trudności, język wydania oraz czas rozgrywki.
- Ustawienia filtrów są zapamiętywane przy kolejnych wyszukiwaniach.

US-008
Tytuł: Otrzymywanie rekomendacji gier
Opis: System generuje rekomendacje na podstawie analizy istniejących gier w kolekcji.
Kryteria akceptacji:
- Rekomendacje pojawiają się po osiągnięciu minimum 10 gier w kolekcji.
- Użytkownik otrzymuje przynajmniej 5 sensownych rekomendacji.
- Rekomendacje bazują na analizie kategorii oraz mechanik gier.

US-009
Tytuł: Ocena satysfakcji użytkownika
Opis: Użytkownik ocenia aplikację po osiągnięciu określonych progów aktywności.
Kryteria akceptacji:
- Formularz oceny pojawia się po określonej liczbie sesji lub dodanych grach.
- Użytkownik może wystawić ocenę tylko raz.
- Administrator otrzymuje dostęp do historii ocen, bez możliwości modyfikacji oceny przez użytkownika.

## 6. Metryki sukcesu
- Brak krytycznych błędów oraz pomyślne przechodzenie wszystkich testów jednostkowych i integracyjnych.
- Średni czas dodawania gry poniżej 1 minuty.
- System rekomendacji generuje co najmniej 5 propozycji przy posiadaniu minimum 10 gier.
- Aktywność użytkowników mierzona liczbą logowań i interakcji.
- Wysokie zadowolenie użytkowników potwierdzone pozytywnymi ocenami satysfakcji. 