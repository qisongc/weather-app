"use client"

import { useEffect, useState, useRef } from "react";
import { Location } from "@/types/location";

export default function LocationSearchComponent() {
    const [searchValue, setSearchValue] = useState("");
    const [searchLocations, setSearchLocations] = useState<Location[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSearchKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchValue}&count=5&language=en&format=json`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setSearchLocations(data.results);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col gap-2 bg-gray-900 p-5">
            <h1 className="text-xl">Location Search</h1>
            <div ref={dropdownRef} className="relative">
                <input className="border-2 p-2 bg-white text-gray-900 w-full" placeholder="Enter location" onKeyUp={handleSearchKeyUp} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onFocus={() => setIsDropdownVisible(true)} />
                {
                    searchLocations && searchLocations.length > 0 && isDropdownVisible && (
                        <div className="flex flex-col absolute bg-gray-900 shadow-2xl shadow-black p-2 bg-white text-gray-900 w-full">
                            {searchLocations.map((location: any, index: number) => (
                                <a key={index} href={`/location?latitude=${location.latitude}&longitude=${location.longitude}&name=${encodeURIComponent(location.name)}&admin1=${encodeURIComponent(location.admin1 || "")}&country=${location.country !== location.name ? encodeURIComponent(location.country || "") : ""}`}>
                                    {location.name}{location.admin1 ? `, ${location.admin1}` : ""}{location.country ? location.country !== location.name ? `, ${location.country}` : "" : ""}
                                </a>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
}