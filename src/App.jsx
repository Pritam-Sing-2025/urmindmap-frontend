import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';

const THEME_STORAGE_KEY = 'ai-mindmap-theme';

function getInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="min-h-screen text-[color:var(--text-strong)]">
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              theme={theme}
              onToggleTheme={() =>
                setTheme((currentTheme) =>
                  currentTheme === 'dark' ? 'light' : 'dark'
                )
              }
            />
          }
        />
        <Route
          path="/app"
          element={
            <AppPage
              theme={theme}
              onToggleTheme={() =>
                setTheme((currentTheme) =>
                  currentTheme === 'dark' ? 'light' : 'dark'
                )
              }
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

