// import React, { useState, useEffect } from 'react';
// import { useFavorites } from '../context/FavoritesContext';
// import PokemonGrid from '../components/PokemonGrid';
// import PokemonModal from '../components/PokemonModal';
// import styles from './FavoritesPage.module.css';

// export default function FavoritesPage() {
//   const { favorites, toggleFavorite } = useFavorites();
//   const [pokemons, setPokemons] = useState([]);
//   const [loading, setLoading]   = useState(false);
//   const [selected, setSelected] = useState(null);

//   useEffect(() => {
//     if (favorites.length === 0) { setPokemons([]); return; }
//     setLoading(true);

//     Promise.all(
//       favorites.map(f =>
//         fetch(`https://pokeapi.co/api/v2/pokemon/${f.id}`)
//           .then(r => r.json())
//           .then(d => ({
//             id: d.id,
//             name: d.name,
//             image:
//               d.sprites.other?.['official-artwork']?.front_default ||
//               d.sprites.front_default,
//             types: d.types.map(t => t.type.name),
//           }))
//       )
//     )
//       .then(res => { setPokemons(res); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, [favorites]);

//   return (
//     <main className={styles.main}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>
//           <span>♥</span> My Favorites
//         </h1>
//         <p className={styles.sub}>
//           {favorites.length === 0
//             ? 'You haven\'t favorited any Pokémon yet.'
//             : `${favorites.length} Pokémon saved`}
//         </p>
//       </div>

//       <PokemonGrid
//         pokemons={pokemons}
//         loading={loading}
//         onSelect={setSelected}
//         emptyMsg="No favorites yet — browse Pokémon and tap ♡ to save them here!"
//       />

//       {selected && (
//         <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
//       )}
//     </main>
//   );
// }





import React, { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import PokemonGrid from '../components/PokemonGrid';
import PokemonModal from '../components/PokemonModal';
import styles from './FavoritesPage.module.css';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (favorites.length === 0) { setPokemons([]); return; }
    setLoading(true);

    Promise.all(
      favorites.map(f =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${f.id}`)
          .then(r => r.json())
          .then(d => ({
            id: d.id,
            name: d.name,
            image:
              d.sprites.other?.['official-artwork']?.front_default ||
              d.sprites.front_default,
            types: d.types.map(t => t.type.name),
          }))
      )
    )
      .then(res => { setPokemons(res); setLoading(false); })
      .catch(() => setLoading(false));
  }, [favorites]);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span>♥</span> My Favorites
        </h1>
        <p className={styles.sub}>
          {favorites.length === 0
            ? 'You haven\'t favorited any Pokémon yet.'
            : `${favorites.length} Pokémon saved`}
        </p>
      </div>

      <PokemonGrid
        pokemons={pokemons}
        loading={loading}
        onSelect={setSelected}
        emptyMsg="No favorites yet — browse Pokémon and tap ♡ to save them here!"
      />

      {selected && (
        <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}