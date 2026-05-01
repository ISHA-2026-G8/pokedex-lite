import React, { useState } from 'react';
import { capitalize, padId, getTypeGradient, typeColor } from '../utils/helpers';
import { useFavorites } from '../context/FavoritesContext';
import styles from './PokemonCard.module.css';

export default function PokemonCard({ pokemon, onClick }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const fav = isFavorite(pokemon.id);

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(pokemon);
  };

  return (
    <article
      className={styles.card}
      style={{ background: getTypeGradient(pokemon.types) }}
      onClick={() => onClick(pokemon)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(pokemon)}
      aria-label={`View ${capitalize(pokemon.name)} details`}
    >
      <div className={styles.id}>#{padId(pokemon.id)}</div>

      <button
        className={`${styles.fav} ${fav ? styles.favActive : ''}`}
        onClick={handleFav}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      >
        {fav ? '♥' : '♡'}
      </button>

      <div className={styles.imageWrap}>
        {!imgError && pokemon.image ? (
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className={styles.image}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.noImage}>?</div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{capitalize(pokemon.name)}</h3>
        <div className={styles.types}>
          {pokemon.types.map(type => (
            <span
              key={type}
              className={styles.type}
              style={{ background: typeColor[type] || '#888' }}
            >
              {capitalize(type)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
