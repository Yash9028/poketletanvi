import { shuffle } from "fast-shuffle";
import Fuse from "fuse.js";

import data from "./data.json";
import PokemonCard from "./components/PokemonCard";

// DOM Selection
const inputEl = document.querySelector("input");
const pokemonRow = document.querySelector("[data-pokemon-row]");

// Render
function renderPokemons(list) {
  // Empty the previous content
  pokemonRow.innerHTML = "";

  list.forEach((pokemonObj) => {
    const { name, image, description, link } = pokemonObj;
    const pokemon = PokemonCard(name, image, description, link);
    pokemonRow.appendChild(pokemon);
  });
}

// Filtering
function renderFilterPokemons(input) {
  // const filteredPokemons = data.filter((obj) =>
  //   obj.name.toLowerCase().includes(input)
  // );

  if (!input) {
    return renderPokemons(data);
  }

  const fuse = new Fuse(data, {
    keys: ["name"],
  });

  const filteredPokemons = fuse.search(input).map((obj) => obj.item);

  // Fallback Pokemon Card
  if (!filteredPokemons.length) {
    renderPokemons([
      {
        name: "Not Found",
        image:
          "https://i.pinimg.com/originals/11/52/0c/11520cf1cc72ad1aab32fb3f26685619.jpg",
        description: "Try a different search term",
      },
    ]);

    return;
  }

  renderPokemons(filteredPokemons);
}

// Listen for input
inputEl.addEventListener("input", (e) => {
  const currentInput = e.target.value.toLowerCase().trim();
  renderFilterPokemons(currentInput);
});

// Add keyboard functionality
document.addEventListener("keyup", (event) => {
  if (event.key === "/") {
    inputEl.focus();
  }
});

// Inital Rendering
renderPokemons(shuffle(data));
