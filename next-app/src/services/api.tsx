import { Forecast, Comments, Location, Account } from "@/types";

export const getForecast = async (latitude: number, longitude: number, name: string, admin1: string, country: string): Promise<Forecast> => {
    const response = await fetch(`/api/get-forecast?latitude=${latitude}&longitude=${longitude}&name=${encodeURIComponent(name || '')}&admin1=${encodeURIComponent(admin1 || '')}&country=${encodeURIComponent(country || '')}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Forecast;
};

export const favouriteLocation = async (account_id: number, location_id: number): Promise<boolean> => {
    const response = await fetch('/api/favourite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_id: account_id, location_id: location_id }),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as boolean;
}

export const unfavouriteLocation = async (account_id: number, location_id: number): Promise<boolean> => {
    const response = await fetch(`/api/unfavourite?account_id=${account_id}&location_id=${location_id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as boolean;
}

export const getIsFavouriteLocation = async (account_id: number, location_id: number): Promise<boolean> => {
    const response = await fetch(`/api/is-favourite?account_id=${account_id}&location_id=${location_id}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as boolean;
};

export const getComments = async (location_id: number, page: number = 1): Promise<Comments> => {
    const response = await fetch(`/api/comments?location_id=${location_id}&page=${page}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Comments;
}

export const postComment = async (account_id: number, location_id: number, content: string): Promise<Comments> => {
    const response = await fetch('/api/comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_id: account_id, location_id: location_id, content: content }),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Comments;
}

export const getTopLocationForecast = async (): Promise<Forecast[]> => {
    const response = await fetch('/api/get-top-location-forecast');
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Forecast[];
};

export const getFavouriteLocations = async (account_id: number): Promise<Location[]> => {
    const response = await fetch(`/api/favourites?account_id=${account_id}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Location[];
};

export const login = async (username: string): Promise<Account> => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Account;
};