export default async function getPokemonInfo(obj) {
  const {res, responseEvolution} = obj;
  const {
    height,
    name,
    order,
    sprites: {
      other
    },
    stats,
    types,
    weight,
    moves
  } = res;

  const pokeTypes = types.map(type => type.type.name);
  const pokeStats = stats.map(stat => ({statistic: stat.stat.name, base_stat: stat.base_stat}));
  const movements = moves.map(move => move.move.name);

  // Getting evolutions
  const chainResponse = getEvolutions(responseEvolution.chain);
  let chainEvolution = [];

  
  await Promise.all(chainResponse).then(responses => {
    responses = responses.map(response => {
      const {name, sprite} = response;
      chainEvolution = [
        ...chainEvolution, {
          name,
          sprite
        }
      ];
    });
  });

  return {
    name,
    order,
    height: Number(height / 10),
    weight: Number(weight / 10),
    image: other["official-artwork"].front_default,
    pokeStats,
    pokeTypes,
    chainEvolution,
    movements
  };
}

function getEvolutions(chain) {
  let pokemons = [];
  while (chain.hasOwnProperty("species")) {
    pokemons = [
      ...pokemons,
      chain.species.name
    ];
    if (chain["evolves_to"][0] === undefined) 
      return getSprites(pokemons);
    chain = chain["evolves_to"][0];
  }
}

function getSprites(pokemons) {
  pokemons = pokemons.map(async poke => {
    const request = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);
    const response = await request.json();
    const sprite = await response.sprites.front_default;
    return {name: poke, sprite};
  });

  return pokemons;
}