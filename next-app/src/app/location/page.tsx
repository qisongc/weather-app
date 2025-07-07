'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Location() {

  const searchParams = useSearchParams();

  const latitude = parseFloat(searchParams.get('latitude') || '');
  const longitude = parseFloat(searchParams.get('longitude') || '');
  const name = searchParams.get('name');
  const admin1 = searchParams.get('admin1');
  const country = searchParams.get('country');

  const [temperatureValue, setTemperatureValue] = useState(0);

  const getForecast = async (latitude: number, longitude: number, name: string, admin1: string, country: string) => {
    try {

      const response = await fetch(`/api/getForecast?latitude=${latitude}&longitude=${longitude}&name=${encodeURIComponent(name || '')}&admin1=${encodeURIComponent(admin1 || '')}&country=${encodeURIComponent(country || '')}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTemperatureValue(data.hourly.temperature_2m[0]);
      console.log("Forecast data:", data);
      // Handle the forecast data as needed
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getForecast(latitude, longitude, name || '', admin1 || '', country || '');
  }, []);

  return (
    <div>
      <h1>Location Info</h1>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Name: {name}</p>
      <p>Region: {admin1}</p>
      <p>Country: {country}</p>
      <p>Temperature: {temperatureValue} °C</p>
    </div>
  );
}
