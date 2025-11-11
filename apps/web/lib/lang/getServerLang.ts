import { cookies } from "next/headers";
import { LanguageType } from "../lang/LanguageType";

export async function getServerLang(defaultLang: LanguageType = "kk"): Promise<LanguageType> {
    const cookieStore = await cookies();
    const langCookie = cookieStore.get("lang")?.value;

    if (langCookie && ["kk", "ru", "en"].includes(langCookie)) {
        return langCookie as LanguageType;
    }

    return defaultLang;
}
