import { useState, useEffect } from "react";

import "./App.css";

function App() {
  // state variables
  const [currentValue, setCurrentValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageURL, setImageURL] = useState("");

  // fetch pokemon data when searchValue change
  useEffect(() => {
    if (searchValue !== "") {
      fetchPokemonImage(searchValue);
    }
  }, [searchValue]);

  const fetchPokemonImage = (pokemonName) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => response.json())
      .then((data) => {
        setImageURL(data.sprites.front_default);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon data:", error);
        setIsLoaded(false);
      });
  };

  const handleInputChange = (event) => {
    setCurrentValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchValue(currentValue);
    }
  };

  const handleSearch = () => {
    setSearchValue(currentValue);
  };

  return (
    <>
      <h1>Welcome to PokeSearch!!!</h1>
      <span>Pokemon name: </span>
      <input
        value={currentValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search!</button>
      {isLoaded && <img src={imageURL} alt="Pokemon" />}
    </>
  );
}

export default App;