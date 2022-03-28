import methods from './requests.js';
import pokeTypesMap from './pokeTypesDictionary.js';

const {searchPokemon} = methods;

const inputSearch = document.querySelector("#input-pokemon");
const btnSearch = document.querySelector('#btnSearch');
const imageDisplay = document.querySelector('#poke-result');
const pokeName = document.querySelector('#poke-result-name');
const otherStats = document.getElementById('other-stats').children;
const containerTypes = document.getElementById('types');
const movesPanel = Array.from(document.querySelector("#moves-panel").children);
const poke_evolutions = document.getElementById("poke-evolutions");

document.addEventListener("DOMContentLoaded", () => {
    btnSearch.addEventListener("click", () => {
        if(inputSearch.value === "") {
            alert("Inserte un pokemón") 
            return;
        }
        dataResults(inputSearch.value);
    })
});

const dataResults = async pokemon => {
    try {
        clearPokedex();
        
        const data = await searchPokemon(pokemon);        
        const { name, order, height, weight, image, pokeStats, pokeTypes, chainEvolution, movements } = data;
        const movesSlicing = movements.slice(0,10).map(movement => movement);
        drawingResults({name, order, height, weight, image, pokeStats, pokeTypes, chainEvolution, movesSlicing})        
    } catch (error) {
        imageDisplay.src = './assets/img/pikachu_con_gorra.jpg';
        pokeName.textContent = error;
    }
    
}

function clearPokedex(){
    clearResults(containerTypes);
    clearResults(poke_evolutions);
    clearResults(document.querySelectorAll('.move'))
    otherStats[0].textContent = "";
    otherStats[1].textContent = "";
    inputSearch.value = "";
    movesPanel.forEach( move => move.textContent = "");
}

function drawingResults(result){
    imageDisplay.src = result.image;
    pokeName.textContent = `#${result.order} - ${result.name}`;
    otherStats[0].textContent = `ALTURA: ${result.height} m.`;
    otherStats[1].textContent = `PESO: ${result.weight} kg.`;
    creatingTypes(result.pokeTypes);
    drawPokeEvolutions(result.chainEvolution);
    drawpokeMovements(result.movesSlicing);
    settingStats(result.pokeStats)
}

function drawpokeMovements(movements){
    // const movesPanel = document.querySelector("#moves-panel").children;
    for(let i = 0; i < movesPanel.length; i++){
        movesPanel[i].className = "move text";
        movesPanel[i].textContent = movements[i];
    }
}

function creatingTypes(resultTypes){
    clearResults(containerTypes)
    resultTypes.forEach(type => {
        const pill = document.createElement("span")
        pill.className = 'poke-type';
        pill.textContent = type;
        pill.style.backgroundColor = pokeTypesMap[type];
        containerTypes.appendChild(pill)
    });
}

function drawPokeEvolutions(evolutions){
    // console.log(evolutions);

    clearResults(poke_evolutions);

    evolutions.forEach( evolution => {
        const pokeArticle = document.createElement("article");

        const pokemonName = document.createElement("small");
        pokemonName.textContent = evolution.name;
        pokemonName.classList.add("text")

        const pokemonImg = document.createElement("img");
        pokemonImg.src = evolution.sprite;

        pokeArticle.appendChild(pokemonImg)
        pokeArticle.appendChild(pokemonName);

        poke_evolutions.appendChild(pokeArticle);
    })
}

function settingStats(stats){
    const estadistics = Array.from(document.querySelector('#estadistics').children);

    for(let i = 0; i < estadistics.length; i++){
        const stat = stats[i].base_stat > 100 ? 100 : stats[i].base_stat;

        const levelStat = Math.floor(stat / 10);        
        const spansSelected = estadistics[i].querySelectorAll(`span:nth-last-child(-n+${levelStat})`)

        clearSpans(estadistics[i].querySelectorAll('span'))

        spansSelected.forEach(span => span.style.backgroundColor = '#32ff7e')
    }
}

function clearSpans(spans){
    spans.forEach(span => span.style.backgroundColor = "#ffffff")
}

function clearResults(container){
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
}