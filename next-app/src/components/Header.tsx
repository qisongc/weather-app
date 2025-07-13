"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useAccount } from "@/contexts/account";
import { login } from "@/apis/authentication";

export default function HeaderComponent() {
    const [usernameValue, setUsernameValue] = useState("");
    const { account, setAccount } = useAccount();

    const handleLoginFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!usernameValue.trim()) {
            return;
        }

        try {
            const accountData = await login(usernameValue);
            setAccount(accountData);
            setUsernameValue("");
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <header>
            <nav className="flex justify-between min-h-20 p-5 items-center bg-gray-900">
                <Link href="/">Home</Link>
                <div className="text-xl">
                    🌦️ Weather App
                </div>
                {
                    account ?
                        <div className="flex gap-2">
                            <span>Welcome, {account?.username}</span>
                            <button className="cursor-pointer" onClick={() => { setAccount(null); }}>Logout</button>
                        </div>
                        :
                        <form className="flex gap-2" onSubmit={handleLoginFormSubmit}>
                            <input className="bg-white text-gray-900 p-2" type="ext" placeholder="Username" value={usernameValue} onChange={(e) => setUsernameValue(e.target.value)} />
                            <button className="cursor-pointer" type="submit">Login</button>
                        </form>
                }
            </nav>
        </header>
    );
};