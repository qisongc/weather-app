"use client"

import { useEffect, useState } from "react";
import { Forecast } from "@/types/location";

import { getTopLocationForecast } from "@/apis/forecast";

export default function TopLocationComponent() {
    const [topLocationForecast, setTopLocationForecast] = useState<Forecast[]>([]);

    useEffect(() => {
        const fetchTopLocationsData = async () => {
            try {
                const data = await getTopLocationForecast();
                setTopLocationForecast(data);
            }
            catch (error) {
                console.error(error);
            }
        };
        fetchTopLocationsData();
    }, []);

    return (
        topLocationForecast && topLocationForecast.length > 0 &&
        (
            <div className="flex flex-col gap-2 bg-gray-900 p-5">
                <h1 className="text-xl">Top Locations</h1>
                <div>
                    {

                        <ul>
                            {topLocationForecast.map((locationForecast: any, index: number) => (
                                <li key={index}>
                                    <a className="flex justify-between" href={`/location?latitude=${locationForecast?.location.latitude}&longitude=${locationForecast?.location.longitude}&name=${encodeURIComponent(locationForecast?.location.name)}&admin1=${encodeURIComponent(locationForecast?.location.admin1 || "")}&country=${locationForecast?.location.country !== locationForecast?.location.name ? encodeURIComponent(locationForecast?.location.country || "") : ""}`}>
                                        <span>
                                            {locationForecast?.location.name}{locationForecast?.location.admin1 ? `, ${locationForecast?.location.admin1}` : ""}{locationForecast?.location.country ? locationForecast?.location.country !== locationForecast?.location.name ? `, ${locationForecast?.location.country}` : "" : ""}
                                        </span>
                                        <span>
                                            {locationForecast?.forecast?.hourly?.temperature_2m[0]}  °C
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
        )
    );
}