import requests

def get_pokemon_names():
    pokemon_names = []
    url = "https://pokeapi.co/api/v2/pokemon-species/"
    
    while url:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            for pokemon in data['results']:
                species_url = pokemon['url']
                species_response = requests.get(species_url)
                if species_response.status_code == 200:
                    species_data = species_response.json()
                    english_name = next(name['name'] for name in species_data['names'] if name['language']['name'] == 'en')
                    chinese_name = next((name['name'] for name in species_data['names'] if name['language']['name'] == 'zh-Hans'), None)
                    if chinese_name:
                        pokemon_names.append(f"{chinese_name}|||{english_name}")
                    print(f"Processed: {chinese_name}")
            url = data['next']
        else:
            print(f"Error fetching data: {response.status_code}")
            break
    
    return pokemon_names

def save_to_file(names, filename='pokemon_names_zh_en.txt'):
    with open(filename, 'w', encoding='utf-8') as f:
        for name in names:
            f.write(f"{name}\n")

if __name__ == "__main__":
    print("Starting to fetch Pokemon names...")
    names = get_pokemon_names()
    print(f"Fetched {len(names)} Pokemon names")
    save_to_file(names)
    print("Pokemon names have been saved to pokemon_names.txt")