export const API_BASE_URL = 'http://localhost:8000/api/v1';

export const AUTH_COOKIE_NAME = 'forum_auth_token';
export const USER_COOKIE_NAME = 'forum_user_data';

export const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  POST: '/post/:id',
  CREATE_POST: '/create-post',
  EDIT_POST: '/edit-post/:id',
  CATEGORY: '/category/:id',
  BRAND: '/brand/:id',
  MODEL: '/model/:id',
  GENERATION: '/generation/:id',
  ADMIN: '/admin',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_BRANDS: '/admin/brands',
  ADMIN_MODELS: '/admin/models',
  ADMIN_GENERATIONS: '/admin/generations'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const COMMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Polskie teksty aplikacji
export const TEXTS = {
  APP_NAME: 'Forum Motoryzacyjne',
  NAVIGATION: {
    HOME: 'Strona główna',
    POSTS: 'Posty',
    CATEGORIES: 'Kategorie',
    PROFILE: 'Profil',
    ADMIN: 'Panel administracyjny',
    LOGIN: 'Zaloguj się',
    REGISTER: 'Zarejestruj się',
    LOGOUT: 'Wyloguj się'
  },
  AUTH: {
    LOGIN_TITLE: 'Zaloguj się',
    REGISTER_TITLE: 'Zarejestruj się',
    EMAIL: 'E-mail',
    PASSWORD: 'Hasło',
    NAME: 'Nazwa użytkownika',
    LOGIN_BUTTON: 'Zaloguj',
    REGISTER_BUTTON: 'Zarejestruj',
    FORGOT_PASSWORD: 'Zapomniałeś hasła?',
    NO_ACCOUNT: 'Nie masz konta?',
    HAVE_ACCOUNT: 'Masz już konto?',
    LOGIN_SUCCESS: 'Pomyślnie zalogowano',
    REGISTER_SUCCESS: 'Konto zostało utworzone',
    LOGOUT_SUCCESS: 'Pomyślnie wylogowano',
    LOGIN_ERROR: 'Błąd logowania',
    REGISTER_ERROR: 'Błąd rejestracji'
  },
  POSTS: {
    TITLE: 'Posty',
    CREATE_POST: 'Dodaj nowy post',
    EDIT_POST: 'Edytuj post',
    POST_TITLE: 'Tytuł posta',
    POST_HEAD: 'Krótki opis',
    POST_BODY: 'Treść posta',
    CATEGORY: 'Kategoria',
    BRAND: 'Marka pojazdu',
    MODEL: 'Model pojazdu',
    GENERATION: 'Generacja',
    SAVE: 'Zapisz',
    CANCEL: 'Anuluj',
    DELETE: 'Usuń',
    EDIT: 'Edytuj',
    CREATED_AT: 'Utworzono',
    AUTHOR: 'Autor',
    COMMENTS: 'Komentarze',
    NO_POSTS: 'Brak postów do wyświetlenia',
    DELETE_CONFIRM: 'Czy na pewno chcesz usunąć ten post?',
    POST_CREATED: 'Post został utworzony',
    POST_UPDATED: 'Post został zaktualizowany',
    POST_DELETED: 'Post został usunięty'
  },
  COMMENTS: {
    TITLE: 'Komentarze',
    ADD_COMMENT: 'Dodaj komentarz',
    COMMENT_CONTENT: 'Treść komentarza',
    REPLY: 'Odpowiedz',
    NO_COMMENTS: 'Brak komentarzy',
    COMMENT_ADDED: 'Komentarz został dodany'
  },
  CATEGORIES: {
    TITLE: 'Kategorie',
    CREATE_CATEGORY: 'Dodaj kategorię',
    CATEGORY_NAME: 'Nazwa kategorii',
    PARENT_CATEGORY: 'Kategoria nadrzędna',
    NO_PARENT: 'Brak (kategoria główna)',
    CATEGORY_CREATED: 'Kategoria została utworzona',
    CATEGORY_UPDATED: 'Kategoria została zaktualizowana',
    CATEGORY_DELETED: 'Kategoria została usunięta'
  },
  CARS: {
    BRANDS: 'Marki pojazdów',
    MODELS: 'Modele pojazdów',
    GENERATIONS: 'Generacje',
    BRAND_NAME: 'Nazwa marki',
    MODEL_NAME: 'Nazwa modelu',
    GENERATION_NAME: 'Nazwa generacji',
    DESCRIPTION: 'Opis',
    SELECT_BRAND: 'Wybierz markę',
    SELECT_MODEL: 'Wybierz model',
    SELECT_GENERATION: 'Wybierz generację',
    CREATE_BRAND: 'Dodaj markę',
    CREATE_MODEL: 'Dodaj model',
    CREATE_GENERATION: 'Dodaj generację'
  },
  COMMON: {
    LOADING: 'Ładowanie...',
    ERROR: 'Wystąpił błąd',
    SUCCESS: 'Operacja zakończona pomyślnie',
    CONFIRM: 'Potwierdź',
    YES: 'Tak',
    NO: 'Nie',
    SEARCH: 'Szukaj',
    FILTER: 'Filtruj',
    RESET: 'Resetuj',
    BACK: 'Wróć',
    NEXT: 'Dalej',
    PREVIOUS: 'Poprzedni',
    PAGE: 'Strona',
    ITEMS_PER_PAGE: 'Elementów na stronie',
    NO_DATA: 'Brak danych',
    REQUIRED_FIELD: 'To pole jest wymagane',
    INVALID_EMAIL: 'Nieprawidłowy adres e-mail',
    PASSWORD_TOO_SHORT: 'Hasło musi mieć co najmniej 6 znaków'
  },
  VALIDATION: {
    REQUIRED: 'To pole jest wymagane',
    EMAIL_INVALID: 'Nieprawidłowy format e-mail',
    PASSWORD_MIN: 'Hasło musi mieć co najmniej 6 znaków',
    PASSWORD_MAX: 'Hasło może mieć maksymalnie 50 znaków',
    NAME_MIN: 'Nazwa musi mieć co najmniej 2 znaki',
    NAME_MAX: 'Nazwa może mieć maksymalnie 50 znaków',
    TITLE_MIN: 'Tytuł musi mieć co najmniej 3 znaki',
    TITLE_MAX: 'Tytuł może mieć maksymalnie 100 znaków',
    CONTENT_MIN: 'Treść musi mieć co najmniej 10 znaków'
  },
  ERRORS: {
    NETWORK: 'Brak połączenia z serwerem',
    UNAUTHORIZED: 'Brak uprawnień do wykonania tej operacji',
    FORBIDDEN: 'Dostęp zabroniony',
    NOT_FOUND: 'Nie znaleziono zasobu',
    SERVER_ERROR: 'Wystąpił błąd serwera',
    VALIDATION_ERROR: 'Błąd walidacji danych',
    USERNAME_TAKEN: 'Nazwa użytkownika jest już zajęta',
    EMAIL_TAKEN: 'Adres e-mail jest już używany',
    INVALID_CREDENTIALS: 'Nieprawidłowe dane logowania',
    DATABASE_ERROR: 'Wystąpił błąd bazy danych'
  }
};
