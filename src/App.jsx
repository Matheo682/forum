import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { store } from './store';
import { ROUTES, TEXTS } from './constants';
import Header from './components/Layout/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

// Tworzenie męskiego ciemnego motywu z stalową kolorystyką
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64748b', // Stalowy szary
      dark: '#475569',
      light: '#94a3b8',
    },
    secondary: {
      main: '#f97316', // Pomarańczowy akcent
      dark: '#ea580c',
      light: '#fb923c',
    },
    background: {
      default: '#0f172a', // Bardzo ciemny granatowy
      paper: '#1e293b', // Ciemny szary
    },
    surface: {
      main: '#334155', // Średni szary
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    error: {
      main: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#059669',
    },
    info: {
      main: '#0284c7',
    },
    // Dodatkowe kolory dla akcentów
    tertiary: {
      main: '#0ea5e9', // Niebieski stalowy
      dark: '#0369a1',
      light: '#38bdf8',
    },
  },
  shape: {
    borderRadius: 12, // Bardziej zaokrąglone rogi
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(15, 23, 42, 0.8)',
    '0px 4px 12px rgba(15, 23, 42, 0.9)',
    '0px 6px 16px rgba(15, 23, 42, 0.95)',
    '0px 8px 20px rgba(15, 23, 42, 0.95)',
    '0px 10px 24px rgba(15, 23, 42, 0.95)',
    ...Array(19).fill('0px 12px 32px rgba(15, 23, 42, 0.95)'),
  ],
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          boxShadow: 'none',
          background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
            boxShadow: '0px 4px 16px rgba(100, 116, 139, 0.4)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        outlined: {
          background: 'transparent',
          borderColor: 'rgba(100, 116, 139, 0.5)',
          '&:hover': {
            background: 'rgba(100, 116, 139, 0.1)',
            borderColor: '#64748b',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(51, 65, 85, 0.3)',
          backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          '&:hover': {
            border: '1px solid rgba(100, 116, 139, 0.5)',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.6)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(100, 116, 139, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(100, 116, 139, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#64748b',
              boxShadow: '0 0 0 3px rgba(100, 116, 139, 0.1)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(51, 65, 85, 0.2)',
          backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
        },
        colorSecondary: {
          background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Router>
            <div className="App">
              <Header />
              <main style={{ 
                minHeight: 'calc(100vh - 64px)', 
                paddingTop: '20px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
              }}>
                <Routes>
                  <Route path={ROUTES.HOME} element={<HomePage />} />
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                  <Route path={ROUTES.POST} element={<PostDetailPage />} />
                  
                  {/* Chronione trasy */}
                  <Route 
                    path={ROUTES.CREATE_POST} 
                    element={
                      <ProtectedRoute>
                        <CreatePostPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path={ROUTES.EDIT_POST} 
                    element={
                      <ProtectedRoute>
                        <CreatePostPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path={ROUTES.PROFILE} 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path={ROUTES.ADMIN} 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
