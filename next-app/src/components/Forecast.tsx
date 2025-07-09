"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useAccount } from "@/contexts/account";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-regular-svg-icons"
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons"
import { Comments, Comment, Forecast } from "@/types";

import { getForecast } from "@/apis/forecast";
import { favouriteLocation, unfavouriteLocation, getIsFavouriteLocation } from "@/apis/favourite"
import { getComments, postComment } from "@/apis/comment";

export default function ForecastComponent() {
    const searchParams = useSearchParams();

    const { account, setAccount } = useAccount();

    const [forecastResponse, setForecastResponse] = useState(null as Forecast | null);
    const [isFavouriteLocationResponse, setIsFavouriteLocationResponse] = useState(false);
    const [commentsResponse, setCommentsResponse] = useState(null as Comments | null);

    const [commentValue, setCommentValue] = useState("");

    const handleFavouriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            if (!account?.id || !forecastResponse?.location?.id) {
                throw new Error("Missing account id or location id");
            }
            const is_location_favourite = await favouriteLocation(account?.id, forecastResponse?.location?.id);
            setIsFavouriteLocationResponse(is_location_favourite);
        } catch (error) {
            console.error("Post error:", error);
        }
    }

    const handleUnfavouriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            if (!account?.id || !forecastResponse?.location?.id) {
                throw new Error("Missing account id or location id");
            }
            const is_location_favourite = await unfavouriteLocation(account?.id, forecastResponse?.location?.id);
            setIsFavouriteLocationResponse(is_location_favourite);
        } catch (error) {
            console.error("Post error:", error);
        }
    }

    const handleCommentPageClick = async (event: React.MouseEvent<HTMLButtonElement>, page: number = 1) => {
        event.preventDefault();
        try {
            if (!forecastResponse?.location?.id) {
                throw new Error("Missing location id");
            }
            const data = await getComments(forecastResponse?.location?.id, page);
            setCommentsResponse(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleCommentPostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!commentValue) {
                return;
            }
            if (!account?.id || !forecastResponse?.location?.id) {
                throw new Error("Missing account id or location id");
            }
            const data = await postComment(account?.id, forecastResponse?.location?.id, commentValue);
            setCommentsResponse(data);
            setCommentValue("");
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const latitude = parseFloat(searchParams.get("latitude") || "");
        const longitude = parseFloat(searchParams.get("longitude") || "");
        const name = searchParams.get("name") || "";
        const admin1 = searchParams.get("admin1") || "";
        const country = searchParams.get("country") || "";

        const fetchForecastData = async () => {
            try {
                const data = await getForecast(latitude, longitude, name, admin1, country);
                setForecastResponse(data)
            } catch (error) {
                console.error(error);
            }
        }

        fetchForecastData();
    }, []);

    useEffect(() => {
        const fetchIsFavouriteLocationData = async () => {
            try {
                if (!account?.id || !forecastResponse?.location?.id) {
                    return;
                }
                const isLocationFavourite = await getIsFavouriteLocation(account?.id, forecastResponse?.location?.id);
                setIsFavouriteLocationResponse(isLocationFavourite || false);
            }
            catch (error) {
                console.error(error);
            }
        };

        if (account) {
            fetchIsFavouriteLocationData();
        }
    }, [account, forecastResponse?.location]);


    useEffect(() => {
        const fetchCommentsData = async () => {
            try {
                if (!forecastResponse?.location?.id) {
                    return;
                }
                const data = await getComments(forecastResponse?.location?.id, 1);
                setCommentsResponse(data);
            }
            catch (error) {
                console.error(error);
            }
        };

        fetchCommentsData();
    }, [forecastResponse?.location]);

    return (
        <div className="flex flex-col gap-5">
            {
                forecastResponse && forecastResponse?.forecast &&
                <div className="flex justify-between gap-2 bg-gray-900 p-5">
                    <div className="flex gap-2 items-center">
                        <div>
                            {isFavouriteLocationResponse ?
                                <button className="cursor-pointer" onClick={(e) => { handleUnfavouriteClick(e) }}>
                                    <FontAwesomeIcon icon={faStarSolid} />
                                </button> :
                                <button className="cursor-pointer" onClick={handleFavouriteClick}>
                                    <FontAwesomeIcon icon={faStar} />
                                </button>
                            }
                        </div>
                        <h1 className="text-xl">{forecastResponse?.location?.name}{forecastResponse?.location.admin1 ? `, ${forecastResponse?.location?.admin1}` : ""}{forecastResponse?.location.country ? forecastResponse?.location.country !== forecastResponse?.location.name ? `, ${forecastResponse?.location.country}` : "" : ""}</h1>
                    </div>
                    <div className="text-4xl">{forecastResponse?.forecast?.hourly?.temperature_2m[0]} °C</div>
                </div>
            }
            {
                commentsResponse && commentsResponse?.comments && commentsResponse?.comments.length > 0 && <div className="flex flex-col gap-2">
                    <h1 className="text-xl">Comments</h1>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            {commentsResponse?.comments.map((comment: Comment, index: number) => (
                                <div className="flex bg-gray-900 p-5 gap-2" key={index}>
                                    <span className="font-bold">{comment?.username}:</span>
                                    <span>{comment?.content}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <ul className="flex gap-5 justify-center">
                        {
                            Array.from({ length: commentsResponse?.total_page || 1 }, (_, i) => (
                                <li key={i}>
                                    <button className={`cursor-pointer ${commentsResponse?.page - 1 === i ? "font-bold underline" : ""}`} onClick={(e) => { handleCommentPageClick(e, i + 1) }}>{i + 1}</button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            }
            {
                account && account?.id && <form className="flex gap-5" onSubmit={handleCommentPostSubmit}>
                    <input className="border-2 border-color-white w-full p-5" value={commentValue} onChange={(e) => setCommentValue(e.target.value)} />
                    <button className="bg-gray-900 p-5 cursor-pointer" type="submit">Post</button>
                </form>
            }
        </div>
    );
}
