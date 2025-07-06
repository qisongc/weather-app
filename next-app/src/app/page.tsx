'use client'

import { useState } from "react";

export default function Home() {

  const [searchValue, setSearchValue] = useState('');
  const [searchLocations, setSearchLocations] = useState<object[]>([]);

  const handleSearchKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchValue}&count=5&language=en&format=json`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Search results:", data);
      setSearchLocations(data.results);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const getForecast = async (latitude: number, longitude: number) => {
    try {

      const response = await fetch(`/api/getForecast?lat=${latitude}&lon=${longitude}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Forecast data:", data);
      // Handle the forecast data as needed
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div>
      <input placeholder="Enter location" onKeyUp={handleSearchKeyDown} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      {
        searchLocations && searchLocations.length > 0 && (
          <ul>
            {searchLocations.map((location: any, index: number) => (
              <li key={index}>
                <button onClick={() => getForecast(location.latitude, location.longitude)}>{location.name}, {location.admin1}, {location.country}</button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}