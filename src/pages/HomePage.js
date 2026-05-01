import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import PokemonGrid from '../components/PokemonGrid';
import Pagination from '../components/Pagination';
import PokemonModal from '../components/PokemonModal';
import { usePokemonList, useAllTypes, useSearch, useTypeFilter } from '../hooks/usePokemon';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [page, setPage]               = useState(1);
  const [query, setQuery]             = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selected, setSelected]       = useState(null);

  const types = useAllTypes();
  const { allPokemon, loading, error, total, pageSize } = usePokemonList(page);
  const { results: searchResults, loading: searchLoading } = useSearch(query);
  const { pokemons: typePokemons, loading: typeLoading } = useTypeFilter(selectedType);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [query, selectedType]);

  const isSearching = query.length >= 2;
  const isFiltering = !!selectedType && !isSearching;

  const displayList = isSearching ? searchResults : isFiltering ? typePokemons : allPokemon;
  const isLoading   = isSearching ? searchLoading : isFiltering ? typeLoading : loading;

  return (
    <main className={styles.main}>
      {/* Hero banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Gotta catch <span>'em all</span>
          </h1>
          <p className={styles.heroSub}>
            Browse {total.toLocaleString()}+ Pokémon — search, filter, and save your favorites.
          </p>
        </div>
        <div className={styles.heroBalls}>
          <div className={styles.ball} style={{ '--hue': '0deg', animationDelay: '0s' }} />
          <div className={styles.ball} style={{ '--hue': '200deg', animationDelay: '0.5s' }} />
          <div className={styles.ball} style={{ '--hue': '120deg', animationDelay: '1s' }} />
        </div>
      </section>

      {/* Controls */}
      <section className={styles.controls}>
        <SearchBar value={query} onChange={setQuery} />
        <div className={styles.filterWrap}>
          <TypeFilter types={types} selected={selectedType} onChange={setSelectedType} />
        </div>
      </section>

      {/* Results info */}
      {!isLoading && (
        <div className={styles.resultsInfo}>
          {isSearching
            ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${query}"`
            : isFiltering
            ? `${typePokemons.length} ${selectedType} type Pokémon`
            : `${total.toLocaleString()} Pokémon — page ${page} of ${Math.ceil(total / pageSize)}`
          }
        </div>
      )}

      {/* Error */}
      {error && !isSearching && !isFiltering && (
        <div className={styles.error}>
          <span>⚠️</span>
          <p>Failed to load Pokémon. Please check your connection and try again.</p>
          <button onClick={() => setPage(p => p)} className={styles.retryBtn}>Retry</button>
        </div>
      )}

      {/* Grid */}
      <PokemonGrid
        pokemons={displayList}
        loading={isLoading}
        onSelect={setSelected}
        emptyMsg={
          isSearching
            ? `No Pokémon found for "${query}"`
            : isFiltering
            ? `No ${selectedType} type Pokémon found`
            : 'No Pokémon found'
        }
      />

      {/* Pagination — only when browsing normally */}
      {!isSearching && !isFiltering && !isLoading && (
        <div className={styles.paginationWrap}>
          <Pagination
            page={page}
            total={total}
            pageSize={pageSize}
            onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
