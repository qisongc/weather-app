export type Comment = {
    id: number;
    accoun_id: number;
    username: string;
    content: string;
    created_at: string;
    location_id: number;
};

export type Comments = {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
    comments: Comment[];
};