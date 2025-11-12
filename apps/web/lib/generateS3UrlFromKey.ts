import {env} from "@/lib/env";

export const generateS3UrlFromKey = (key: string): string => {
    return `${env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${key}`
}