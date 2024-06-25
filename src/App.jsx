import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentValue, setCurrentValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [error, setError] = useState(null);
  const [pokeData, setPokeData] = useState({});

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        // 检查本地存储中是否有数据
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
            // 添加其他需要的数据
          };
        }

        setPokeData(detailedData);
        // 存储到本地存储
        localStorage.setItem('pokeData', JSON.stringify(detailedData));
      } catch (e) {
        console.error('Error fetching Pokemon data: ', e);
      }
    }
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    function searchPoke() {
      if (searchValue !== '') {
        const pokeId = findPokeByName(searchValue);
        if (pokeId) {
          setImageURL(getPokemonImageUrl(pokeId));
          setIsLoaded(true);
        } else {
          setError("Pokemon not found");
          setIsLoaded(false);
        }
      }
    }
    searchPoke();
  }, [searchValue, pokeData])

  function findPokeByName(name) {
    const lowerName = name.toLowerCase();
    for (const id in pokeData) {
      const pokemon = pokeData[id];
      if (pokemon.names.some(n => n.name.toLowerCase() === lowerName)) {
        return pokemon.id;
      }
    }
    // 如果输入的是数字ID
    if (!isNaN(name) && pokeData[name]) {
      return parseInt(name);
    }
    return null;
  }

  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  const handleInputChange = (event) => {
    setCurrentValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchValue(currentValue);
    }
  };

  const handleSearch = () => {
    setError(null);
    setIsLoaded(false);
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
        placeholder="Poke name or number"
      />
      <button onClick={handleSearch}>Search!</button>
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