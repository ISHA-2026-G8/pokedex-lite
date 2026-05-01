export const capitalize = str =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ') : '';

export const padId = id => String(id).padStart(3, '0');

export const typeColor = {
  normal:   '#a8a878',
  fire:     '#f08030',
  water:    '#6890f0',
  electric: '#f8d030',
  grass:    '#78c850',
  ice:      '#98d8d8',
  fighting: '#c03028',
  poison:   '#a040a0',
  ground:   '#e0c068',
  flying:   '#a890f0',
  psychic:  '#f85888',
  bug:      '#a8b820',
  rock:     '#b8a038',
  ghost:    '#705898',
  dragon:   '#7038f8',
  dark:     '#705848',
  steel:    '#b8b8d0',
  fairy:    '#ee99ac',
};

export const getTypeGradient = (types) => {
  if (!types || types.length === 0) return 'linear-gradient(135deg, #2a2a50, #1a1a35)';
  const c1 = typeColor[types[0]] || '#6890f0';
  const c2 = types[1] ? typeColor[types[1]] : c1;
  return `linear-gradient(135deg, ${c1}33, ${c2}22)`;
};

export const statMax = { hp: 255, attack: 190, defense: 230, 'special-attack': 194, 'special-defense': 230, speed: 200 };

export const statColor = (name) => {
  const colors = {
    hp: '#ff5959',
    attack: '#f5ac78',
    defense: '#fae078',
    'special-attack': '#9db7f5',
    'special-defense': '#a7db8d',
    speed: '#fa92b2',
  };
  return colors[name] || '#a0a0c0';
};
