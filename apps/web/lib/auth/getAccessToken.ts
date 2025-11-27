import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth/authOptions";
import {getSession} from "next-auth/react";

const getAccessToken = async () : Promise<string | null> => {
    if (typeof window === 'undefined') {
        // server
        // @ts-ignore
        const session = await getServerSession(authOptions)
        return session?.accessToken ?? null
    } else {
        // client
        const session = await getSession()
        return session?.accessToken?? null
    }
};

export default getAccessToken;