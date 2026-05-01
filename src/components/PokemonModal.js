import React, { useEffect } from 'react';
import { usePokemonDetail } from '../hooks/usePokemon';
import { useFavorites } from '../context/FavoritesContext';
import { capitalize, padId, typeColor, statColor, statMax } from '../utils/helpers';
import styles from './PokemonModal.module.css';

export default function PokemonModal({ pokemon: basicPokemon, onClose }) {
  const { pokemon, loading, error } = usePokemonDetail(basicPokemon?.name);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const displayPokemon = pokemon || basicPokemon;
  const fav = isFavorite(displayPokemon.id);

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`${capitalize(displayPokemon.name)} details`}>
        {/* Close button */}
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        {/* Hero section */}
        <div
          className={styles.hero}
          style={{ background: `linear-gradient(135deg, ${typeColor[displayPokemon.types?.[0]] || '#6890f0'}44 0%, transparent 70%)` }}
        >
          <div className={styles.heroId}>#{padId(displayPokemon.id)}</div>

          <div className={styles.imageContainer}>
            {loading && !pokemon ? (
              <div className={`${styles.imgSkeleton} skeleton`} />
            ) : (
              <img
                src={displayPokemon.image}
                alt={displayPokemon.name}
                className={styles.heroImage}
              />
            )}
          </div>

          <div className={styles.heroInfo}>
            <h2 className={styles.heroName}>{capitalize(displayPokemon.name)}</h2>
            <div className={styles.heroTypes}>
              {displayPokemon.types?.map(type => (
                <span
                  key={type}
                  className={styles.type}
                  style={{ background: typeColor[type] || '#888' }}
                >
                  {capitalize(type)}
                </span>
              ))}
            </div>

            <button
              className={`${styles.favBtn} ${fav ? styles.favActive : ''}`}
              onClick={() => toggleFavorite(displayPokemon)}
            >
              {fav ? '♥ Favorited' : '♡ Add to Favorites'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {loading && !pokemon ? (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <p>Loading details…</p>
            </div>
          ) : error ? (
            <p className={styles.error}>Failed to load details.</p>
          ) : pokemon ? (
            <>
              {pokemon.description && (
                <p className={styles.description}>{pokemon.description}</p>
              )}

              {/* Quick stats */}
              <div className={styles.quickStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Height</span>
                  <span className={styles.statValue}>{(pokemon.height / 10).toFixed(1)} m</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Weight</span>
                  <span className={styles.statValue}>{(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Abilities</span>
                  <span className={styles.statValue}>{pokemon.abilities.map(capitalize).join(', ')}</span>
                </div>
              </div>

              {/* Base stats */}
              <h3 className={styles.sectionTitle}>Base Stats</h3>
              <div className={styles.stats}>
                {pokemon.stats.map(s => (
                  <div key={s.name} className={styles.statRow}>
                    <span className={styles.statName}>{capitalize(s.name)}</span>
                    <span className={styles.statNum}>{s.value}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${Math.min(100, (s.value / (statMax[s.name] || 255)) * 100)}%`,
                          background: statColor(s.name),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
