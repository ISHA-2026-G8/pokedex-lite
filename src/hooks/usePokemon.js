import { useState, useEffect, useCallback } from 'react';

const POKE_API = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 20;

export function usePokemonList(page) {
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [total, setTotal]           = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const offset = (page - 1) * PAGE_SIZE;

    fetch(`${POKE_API}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`)
      .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then(async data => {
        if (cancelled) return;
        setTotal(data.count);

        // Fetch basic details for each pokemon (for type info + image)
        const details = await Promise.all(
          data.results.map(p =>
            fetch(p.url)
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
        );

        if (!cancelled) {
          setAllPokemon(details);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [page]);

  return { allPokemon, loading, error, total, pageSize: PAGE_SIZE };
}

export function usePokemonDetail(nameOrId) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetch_ = useCallback(() => {
    if (!nameOrId) return;
    setLoading(true);
    setError(null);

    fetch(`${POKE_API}/pokemon/${nameOrId}`)
      .then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); })
      .then(async d => {
        // Fetch species for description
        let description = '';
        try {
          const spec = await fetch(d.species.url).then(r => r.json());
          const entry = spec.flavor_text_entries.find(e => e.language.name === 'en');
          description = entry ? entry.flavor_text.replace(/\f|\n/g, ' ') : '';
        } catch {}

        setPokemon({
          id: d.id,
          name: d.name,
          image:
            d.sprites.other?.['official-artwork']?.front_default ||
            d.sprites.front_default,
          types: d.types.map(t => t.type.name),
          abilities: d.abilities.map(a => a.ability.name),
          height: d.height,
          weight: d.weight,
          stats: d.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
          description,
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [nameOrId]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { pokemon, loading, error };
}

export function useAllTypes() {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetch(`${POKE_API}/type?limit=100`)
      .then(r => r.json())
      .then(d => setTypes(d.results.map(t => t.name).filter(t => t !== 'unknown' && t !== 'shadow')))
      .catch(() => {});
  }, []);

  return types;
}

export function useSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`${POKE_API}/pokemon/${query.toLowerCase().trim()}`)
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(d => {
          setResults([{
            id: d.id,
            name: d.name,
            image:
              d.sprites.other?.['official-artwork']?.front_default ||
              d.sprites.front_default,
            types: d.types.map(t => t.type.name),
          }]);
          setLoading(false);
        })
        .catch(() => {
          // Try partial match from the full list
          fetch(`${POKE_API}/pokemon?limit=1302`)
            .then(r => r.json())
            .then(data => {
              const matched = data.results
                .filter(p => p.name.includes(query.toLowerCase()))
                .slice(0, 12);

              return Promise.all(
                matched.map(p =>
                  fetch(p.url)
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
              );
            })
            .then(res => { setResults(res); setLoading(false); })
            .catch(() => { setResults([]); setLoading(false); });
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}

export function useTypeFilter(typeName) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!typeName) { setPokemons([]); return; }
    setLoading(true);

    fetch(`${POKE_API}/type/${typeName}`)
      .then(r => r.json())
      .then(async data => {
        const subset = data.pokemon.slice(0, 40);
        const details = await Promise.all(
          subset.map(({ pokemon: p }) =>
            fetch(p.url)
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
        );
        setPokemons(details);
        setLoading(false);
      })
      .catch(() => { setPokemons([]); setLoading(false); });
  }, [typeName]);

  return { pokemons, loading };
}
