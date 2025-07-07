'use client'

import { useState } from "react";

export default function Home() {

  const [usernameValue, setUsernameValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchLocations, setSearchLocations] = useState<object[]>([]);

  const handleSearchKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleUsernameKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: usernameValue }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        localStorage.setItem('username', usernameValue);
        console.log("Login successful:", data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  return (
    <div>
      <div>
        { localStorage.getItem('username') ? <div> <p>User: {localStorage.getItem('username')}</p> <button onClick={() => { localStorage.removeItem('username'); setUsernameValue(''); }}>Logout</button> </div> : <input placeholder="Enter username" onKeyDown={handleUsernameKeyDown} value={usernameValue} onChange={(e) => setUsernameValue(e.target.value)} />}
      </div>
      <div>
        <input placeholder="Enter location" onKeyUp={handleSearchKeyUp} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        {
          searchLocations && searchLocations.length > 0 && (
            <ul>
              {searchLocations.map((location: any, index: number) => (
                <li key={index}>
                  <a href={`/location?latitude=${location.latitude}&longitude=${location.longitude}&name=${encodeURIComponent(location.name)}&admin1=${encodeURIComponent(location.admin1 || '')}&country=${location.country !== location.name ?encodeURIComponent(location.country || '') : ''}`}>
                    { location.name }{ location.admin1 ?  `, ${location.admin1}` : ''}{location.country ? location.country !== location.name ? `, ${location.country}` : '' : ''}
                  </a>
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  );
}