import { Account } from "@/types";

export const login = async (username: string): Promise<Account> => {
    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json()) as Account;
};