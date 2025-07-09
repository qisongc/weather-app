"use client"

import LocationSearch from "@/components/LocationSearch";
import TopLocations from "@/components/TopLocations";
import FavouriteLocations from "@/components/FavouriteLocations";

export default function Home() {
    return (
        <div className="flex flex-col gap-5">
            <LocationSearch />
            <TopLocations />
            <FavouriteLocations />
        </div>
    );
}