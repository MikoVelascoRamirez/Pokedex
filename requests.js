import getPokemonInfo from "./destructuring_data.js";

const searchPokemon = async name =>{
    const pokeName = name.toLowerCase();
    const request = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
    try {
        const response = await request.json();
        return getPokemonType(response)
    } catch {
        throw new Error('El pokemón no existe, :(');
    }

}

const getPokemonType = async res => {
    const specie = res.species.url; // https://pokeapi.co/api/v2/pokemon-species/1/
    const requestSpecie = await fetch(specie);
    const response = await requestSpecie.json();

    return getEvolutionChain({res, response})

}

const getEvolutionChain = async ({res, response}) => {
    const getEvolutionChain = await fetch(response.evolution_chain.url); //https://pokeapi.co/api/v2/evolution-chain/1/
    const responseEvolution = await getEvolutionChain.json();
    return getPokemonInfo({res, responseEvolution});
}

const methods = { searchPokemon, getEvolutionChain }

export default methods;