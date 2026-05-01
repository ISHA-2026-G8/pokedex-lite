import React from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        type="text"
        placeholder="Search Pokémon by name…"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search Pokémon"
      />
      {value && (
        <button className={styles.clear} onClick={() => onChange('')} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}
