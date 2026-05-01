import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import styles from './Header.module.css';
import UserMenu from './UserMenu';

export default function Header({ activePage, setActivePage }) {
  const { favorites } = useFavorites();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button className={styles.logo} onClick={() => setActivePage('home')}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>Pokédex</span>
          <span className={styles.logoSub}>LITE</span>
        </button>

        <nav className={styles.nav}>
          <button
            className={`${styles.navBtn} ${activePage === 'home' ? styles.active : ''}`}
            onClick={() => setActivePage('home')}
          >
            Browse
          </button>
          <button
            className={`${styles.navBtn} ${activePage === 'favorites' ? styles.active : ''}`}
            onClick={() => setActivePage('favorites')}
          >
            Favorites
            {favorites.length > 0 && (
              <span className={styles.badge}>{favorites.length}</span>
            )}
          </button>
        </nav>

        <UserMenu />
        
      </div>
    </header>
  );
}
