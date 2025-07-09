export type Location = {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    admin1?: string;
    country?: string;
    search_count: number;
};

export type Forecast = {
    location: Location,
    forecast: any,
}