"use client";

import {useState, useEffect, useCallback} from "react";
import {usePathname, useRouter} from "next/navigation";
import {LanguageType} from "@/lib/lang/LanguageType";

export function useLang(defaultLang: LanguageType = "kk") : [LanguageType, (newLanguage: LanguageType) => void] {
    const [lang, setLang] = useState<LanguageType>(defaultLang);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const match = document.cookie.match(/(?:^|; )lang=([^;]*)/);

        if (match) {
            setLang(decodeURIComponent(match[1] ?? "kk") as LanguageType);
        }
    }, []);

    const changeLang = useCallback((newLang: LanguageType) => {
        document.cookie = `lang=${newLang}; path=/; max-age=${60 * 60 * 24 * 365 * 10}`;
        setLang(newLang);


        if (pathname == null) return;

        const parts = pathname.split("/");
        if (["kk", "ru", "en"].includes(parts[1] ?? "")) {
            parts[1] = newLang;
        } else {
            parts.splice(1, 0, newLang);
        }
        const newPath = parts.join("/") || `/${newLang}`;

        window.location.replace(newPath);
    }, []);


    return [lang, changeLang]
}
