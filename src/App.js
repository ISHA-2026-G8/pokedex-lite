import React, { useState } from 'react';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider, useAuth  } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import styles from './App.module.css';
import LoginPage from './pages/LoginPage';




function AppShell() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('home');

  // Show nothing while restoring session (avoids flash of login screen)
  if (loading) {
    return (
      <div className={styles.app}>
        <div className={styles.blob1} aria-hidden="true" />
        <div className={styles.blob2} aria-hidden="true" />
        <div className={styles.initialLoader} aria-label="Loading…">
          <span className={styles.loaderSpinner} aria-hidden="true" />
        </div>
      </div>
    );
  }

  // Not signed in → show login page
  if (!user) {
    return (
      <div className={styles.app}>
        <div className={styles.blob1} aria-hidden="true" />
        <div className={styles.blob2} aria-hidden="true" />
        <LoginPage />
      </div>
    );
  }

  // Signed in → full app
  return (
    <FavoritesProvider>
      <div className={styles.app}>
        <div className={styles.blob1} aria-hidden="true" />
        <div className={styles.blob2} aria-hidden="true" />

        <Header activePage={activePage} setActivePage={setActivePage} />

        {activePage === 'home'      && <HomePage />}
        {activePage === 'favorites' && <FavoritesPage />}

        <footer className={styles.footer}>
          <p>
            Built with ♥ using{' '}
            <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokéAPI</a>.
            Pokémon
          </p>
        </footer>
      </div>
    </FavoritesProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
