import React from 'react';
import PokemonCard from './PokemonCard';
import SkeletonCard from './SkeletonCard';
import styles from './PokemonGrid.module.css';

export default function PokemonGrid({ pokemons, loading, onSelect, emptyMsg }) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!pokemons || pokemons.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🔍</span>
        <p>{emptyMsg || 'No Pokémon found.'}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {pokemons.map((p, i) => (
        <div key={p.id} style={{ animationDelay: `${i * 0.04}s` }}>
          <PokemonCard pokemon={p} onClick={onSelect} />
        </div>
      ))}
    </div>
  );
}
