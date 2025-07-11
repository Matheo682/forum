# Forum Motoryzacyjne SPA

Nowoczesne forum motoryzacyjne zbudowane w React z hierarchiczną strukturą kategorii samochodowych.

## 🚗 Funkcje

- **Hierarchiczne kategorie**: Kategoria → Marka → Model → Generacja
- **System postów**: Tworzenie, edycja i komentowanie postów
- **Zaawansowane filtrowanie**: Wyszukiwanie po tytule, kategorii i marce
- **Responsywny design**: Sidebar na desktop, hamburger menu na mobile
- **Panel admina**: Zarządzanie kategoriami, markami i postami
- **Autentyfikacja**: Rejestracja, logowanie z JWT

## 🛠️ Technologie

- **Frontend**: React 19, Material-UI, Redux Toolkit
- **Routing**: React Router DOM
- **Formularze**: React Hook Form + Yup
- **HTTP**: Axios
- **Build tool**: Vite
- **Styling**: Emotion (CSS-in-JS)

## 🚀 Instalacja

```bash
# Klonowanie repozytorium
git clone <repo-url>
cd forum-spa

# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev

# Build dla produkcji
npm run build
```

## 📱 Responsywność

- **Desktop**: Sidebar z filtrami po lewej stronie, szerokie posty
- **Mobile**: Hamburger menu z filtrami, kompaktowy layout
- **Tablet**: Adaptacyjny design między mobile a desktop

## 🎨 Design

- **Motyw**: Ciemny, męski design z gradientami
- **Kolory**: Stalowa paleta z pomarańczowymi akcentami
- **Typografia**: Nowoczesna z gradientami na nagłówkach
- **Komponenty**: Material-UI z custom styling

## 📊 Architektura

```
src/
├── components/     # Komponenty UI
├── pages/         # Strony aplikacji
├── store/         # Redux store i slices
├── services/      # API services
├── hooks/         # Custom React hooks
├── utils/         # Funkcje pomocnicze
└── constants/     # Stałe aplikacji
```
