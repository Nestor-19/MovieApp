import { useEffect, useState } from "react";

export interface CurrentUser {
    email: string,
    firstName: string,
    lastName: string
}

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);
    const backendUrl = process.env.NEXT_PUBLIC_URL_LOCAL_BACKEND;

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${backendUrl}/api/me`, {
                    credentials: "include"
                })
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`)
                }
                setUser(await res.json());
            } catch (e: any) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        })();
    }, []);

    return {user, loading, error}
}