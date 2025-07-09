import { Forecast } from "@/types";

export const getForecast = async (latitude: number, longitude: number, name: string, admin1: string, country: string): Promise<Forecast> => {
    const response = await fetch(`/api/get-forecast?latitude=${latitude}&longitude=${longitude}&name=${encodeURIComponent(name || "")}&admin1=${encodeURIComponent(admin1 || "")}&country=${encodeURIComponent(country || "")}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Forecast;
};

export const getTopLocationForecast = async (): Promise<Forecast[]> => {
    const response = await fetch("/api/get-top-location-forecast");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Forecast[];
};

export const getGeolocationSuggestions = async (searchValue: string): Promise<any> => {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchValue}&count=5&language=en&format=json`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return await response.json();
}