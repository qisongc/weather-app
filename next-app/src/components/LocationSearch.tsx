"use client"

import { useEffect, useState, useRef } from "react";
import { Location } from "@/types/location";
import { getGeolocationSuggestions } from "@/apis/forecast";

export default function LocationSearchComponent() {
    const [searchValue, setSearchValue] = useState("");
    const [searchLocations, setSearchLocations] = useState<Location[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(async () => {
            try {
                const suggestions = await getGeolocationSuggestions(searchValue);
                const data = suggestions.results;
                setSearchLocations(data);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        }, 500);
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
                    searchLocations && searchLocations?.length > 0 && isDropdownVisible && (
                        <div className="flex flex-col absolute bg-gray-900 shadow-2xl shadow-black p-2 bg-white text-gray-900 w-full">
                            {searchLocations.map((location: any, index: number) => (
                                <a key={index} href={`/location?latitude=${location?.latitude}&longitude=${location?.longitude}&name=${encodeURIComponent(location?.name)}&admin1=${encodeURIComponent(location?.admin1 || "")}&country=${location?.country !== location?.name ? encodeURIComponent(location?.country || "") : ""}`}>
                                    {location?.name}{location?.admin1 ? `, ${location?.admin1}` : ""}{location?.country ? location?.country !== location?.name ? `, ${location?.country}` : "" : ""}
                                </a>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
}