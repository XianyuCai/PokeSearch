import { useState, useEffect } from "react";
import md5 from "md5";
import "./App.css";
const baiduAppid = import.meta.env.VITE_BAIDU_APPID ?? 'default_appid';
const baiduAPIkey = import.meta.env.VITE_BAIDU_APIKEY;

function translateText(text, from , to) {
  const salt = Math.random().toString(36).substring(2, 6);
  const sign = md5(baiduAppid + text + salt + baiduAPIkey);
  
  const url = `/api/api/trans/vip/translate?q=${encodeURIComponent(text)}&from=${from}&to=${to}&appid=${baiduAppid}&salt=${salt}&sign=${sign}`;  
  const result = fetch(url)
          .then(response => response.json())
          .then(data => data.trans_result[0].dst);
  return result;
} 

function App() {
  // state variables
  const [currentValue, setCurrentValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageURL, setImageURL] = useState("");

  // fetch pokemon data when searchValue change
  useEffect(() => {
    if (searchValue !== '') {
      translateText(searchValue, 'auto', 'en')
        .then(translatedName => {
          const firstString = translatedName.split(' ')[0].toLowerCase();
          return fetch(`https://pokeapi.co/api/v2/pokemon/${firstString}`);
        })
        .then(response => response.json())
        .then(data => {
          setImageURL(data.sprites.front_default);
          setIsLoaded(true);
        })
        .catch(error => {
          console.error('Error fetching Pokemon data:', error);
          setIsLoaded(false);
        });
    }
  }, [searchValue]);

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