import { Forecast, Location } from "@/types";

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