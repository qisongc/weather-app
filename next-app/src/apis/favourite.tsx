import { Location } from "@/types";

export const getIsFavouriteLocation = async (account_id: number, location_id: number): Promise<boolean> => {
    const response = await fetch(`/api/is-favourite-location?account_id=${account_id}&location_id=${location_id}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as boolean;
};

export const favouriteLocation = async (account_id: number, location_id: number): Promise<boolean> => {
    const response = await fetch("/api/favourite-location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ account_id: account_id, location_id: location_id }),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as boolean;
}

export const unfavouriteLocation = async (account_id: number, location_id: number): Promise<boolean> => {
    const response = await fetch(`/api/unfavourite-location?account_id=${account_id}&location_id=${location_id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as boolean;
}

export const getFavouriteLocations = async (account_id: number): Promise<Location[]> => {
    const response = await fetch(`/api/favourite-locations?account_id=${account_id}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Location[];
};