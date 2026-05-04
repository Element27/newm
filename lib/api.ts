export const SERVER_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
import { getSupabaseBrowser } from "./supabase";

async function getAuthHeaders(): Promise<Record<string, string>> {
    if (typeof window === "undefined") return {};
    const supabase = getSupabaseBrowser();
    if (!supabase) return {};

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return {};

    return {
        Authorization: `Bearer ${token}`,
    };
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const authHeaders = await getAuthHeaders();
    const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "API request failed");
    }

    return response.json();
};

export const apiUpload = async (file: File, name: string, category?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    if (category && category !== "auto") {
        formData.append("category", category);
    }
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
            ...authHeaders,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
    }

    return response.json();
};
