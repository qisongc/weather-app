import { Comments } from "@/types";

export const postComment = async (account_id: number, location_id: number, content: string): Promise<Comments> => {
    const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ account_id: account_id, location_id: location_id, content: content }),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Comments;
}


export const getComments = async (location_id: number, page: number = 1): Promise<Comments> => {
    const response = await fetch(`/api/comments?location_id=${location_id}&page=${page}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Comments;
}