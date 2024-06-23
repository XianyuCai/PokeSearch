import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [currentValue, setCurrentValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (searchValue !== "") {
      fetch("https://pokeapi.co/api/v2/pokemon/" + searchValue)
      .then((data) => {
        return data.json()
      })
      .then((json_data) => {
        console.log(json_data)
        setImageURL(json_data.sprites.front_default);
        setIsLoaded(true)
      })
    }
  }, [searchValue])

  return (
    <>
      <h1>Welcome to PokeSearch!!!</h1>
      <span>Pokemon name: </span><input value={currentValue} onChange={(event) => setCurrentValue(event.target.value)}/>
      <button onClick={() => setSearchValue(currentValue)}>Search!</button>
      {isLoaded && <img src={imageURL} />}
    </>
  )
}

export default App