"use client"

import { useEffect, useState } from "react";
import { useAccount } from "@/contexts/account";
import { Location } from "@/types/location";

import { getFavouriteLocations } from "@/services/api";

export default function FavouriteLocationsComponent() {
    const { account, setAccount } = useAccount();
    const [favouriteLocations, setFavouriteLocations] = useState<Location[]>([]);

    useEffect(() => {
        setFavouriteLocations([]);
        const fetchFavouriteLocationsData = async () => {
            try {
                if (!account?.id) {
                    return;
                }
                const data = await getFavouriteLocations(account?.id);
                setFavouriteLocations(data);
            }
            catch (error) {
                console.error(error);
            }
        };
        fetchFavouriteLocationsData();
    }, [account?.id]);

    return (
        account && account?.id && favouriteLocations && favouriteLocations.length > 0 &&
        (
            <div className="flex flex-col gap-2 bg-gray-900 p-5">
                <h1 className="text-xl">Favourite Locations</h1>
                <div>
                    <ul>
                        {favouriteLocations.map((location: any, index: number) => (
                            <li key={index}>
                                <a href={`/location?latitude=${location.latitude}&longitude=${location.longitude}&name=${encodeURIComponent(location.name)}&admin1=${encodeURIComponent(location.admin1 || "")}&country=${location.country !== location.name ? encodeURIComponent(location.country || "") : ""}`}>
                                    {location.name}{location.admin1 ? `, ${location.admin1}` : ""}{location.country ? location.country !== location.name ? `, ${location.country}` : "" : ""}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    );
}