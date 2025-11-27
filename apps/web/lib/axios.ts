import axios, { AxiosInstance } from "axios";
import {env} from "@/lib/env";

export function createApi(token?: string, lang?: string): AxiosInstance {
    const instance = axios.create({
        baseURL: env.NEXT_PUBLIC_BACKEND_URL,
    });

    console.log(token)

    instance.interceptors.request.use((config) => {

        let acceptLang = lang;

        if (typeof window !== "undefined") {
            const match = document.cookie.match(/(?:^|; )lang=([^;]*)/);

            if (match) {
                acceptLang = decodeURIComponent(match[1] ?? "kk")
            }
        }

        if (token) config.headers.Authorization = `Bearer ${token}`;

        config.headers = config.headers ?? {};
        if (!("Accept-Language" in config.headers)) {
            config.headers["Accept-Language"] = acceptLang;
        }

        return config;
    });

    return instance;
}