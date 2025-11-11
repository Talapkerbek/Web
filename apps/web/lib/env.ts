import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {

    },

    client: {
        NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL: z.string().min(1),
        NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1)
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL,
        NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME
    }
});