import {getRequestConfig} from 'next-intl/server';
import {getServerLang} from "@/lib/lang/getServerLang";

export default getRequestConfig(async () => {
    const locale = await getServerLang()

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});