import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentValue, setCurrentValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [error, setError] = useState(null);
  const [pokeData, setPokeData] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        const storedData = localStorage.getItem('pokeData');
        if (storedData) {
          setPokeData(JSON.parse(storedData));
          return;
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=1025`);
        const data = await response.json();
        const detailedData = {};

        for (const pokemon of data.results) {
          const speciesResponse = await fetch(pokemon.url);
          const speciesData = await speciesResponse.json();
          detailedData[speciesData.id] = {
            id: speciesData.id,
            names: speciesData.names,
          };
        }

        setPokeData(detailedData);
        localStorage.setItem('pokeData', JSON.stringify(detailedData));
      } catch (e) {
        console.error('Error fetching Pokemon data: ', e);
      }
    }
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    function searchPoke() {
      console.log("Searching for: ", searchValue)
      if (searchValue !== '') {
        const pokeId = findPokeByName(searchValue);
        console.log("poke Id: ", pokeId);
        if (pokeId) {
          setImageURL(getPokemonImageUrl(pokeId));
          setIsLoaded(true);
          setError(null)
        } else {
          setError("Pokemon not found");
          setIsLoaded(false);
        }
      }
    }
    searchPoke();
  }, [searchValue, pokeData])

  function findPokeByName(name) {
    
    if (!isNaN(name) && pokeData[name]) {
      return parseInt(name);
    }

    const lowerName = name.toLowerCase();
    for (const id in pokeData) {
      const pokemon = pokeData[id];
      if (pokemon.names.some(n => n.name.toLowerCase() === lowerName)) {
        return pokemon.id;
      }
    }
    return null;
  }

  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  const handleInputChange = (event) => {
    const value = event.target.value;
    console.log("Input change to: ", value);
    setCurrentValue(value);
    updateSuggestions(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchValue(currentValue);
      setError(null);
      setIsLoaded(false);
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    startNewSearch();
  };

  const startNewSearch = () => {
    setError(null);
    setIsLoaded(false);
    setSearchValue(currentValue);
    setSuggestions([])
  }

  const handleSuggestionClick = (name) => {
    console.log("Suggestion: ", name)
    startNewSearch();
    setSearchValue(name);
    setCurrentValue(name);
    setError(null);
    setIsLoaded(false)
  }

  const updateSuggestions = (value) => {
    if (value.length > 0) {
      const lowerValue = value.toLowerCase();
      const uniqueNames = new Set();
      const suggestion = Object.values(pokeData)
        .flatMap(pokemon => pokemon.names)
        .filter(name => {
          const lowerName = name.name.toLowerCase();
          if (lowerName.startsWith(lowerValue) && !uniqueNames.has(lowerName)) {
            uniqueNames.add(lowerName);
            return true;
          }
          return false;
        })
        .slice(0, 5);
      setSuggestions(suggestion);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <>
      <h1>Welcome to PokeSearch!!!</h1>
      <div className="search-container">
        <span>Pokemon name: </span>
        <input
          value={currentValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Poke name or number"
        />
        <button onClick={handleSearch}>Search!</button>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion.name)}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isLoaded && imageURL && (
        <img
          src={imageURL}
          alt="Pokemon"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'path/to/fallback/image.png';
          }}
        />
      )}
      {error && <p className="error-message">{error}</p>}
    </>
  );
}


export default App;