import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {env} from "../env";
import {generateS3UrlFromKey} from "@/lib/generateS3UrlFromKey";

type IdTokenType = {
    firstName: string
    lastName: string
    email: string
    image: string
    role: string
}

export const authOptions = {
    providers: [
        {
            id: "pharosIdentityServer",
            name: "School Identity Server",
            type: "oauth",
            clientId: "talapker-nextjs",
            wellKnown: `${env.NEXT_PUBLIC_IDENTITY_URL}/.well-known/openid-configuration`,
            authorization: { params: { scope: "openid IdentityServer.fullaccess Institutions.fullaccess offline_access", culture: "kk" } },
            idToken: true,
            checks: ["pkce", "state"],
            clientSecret: "talapker-nextjs-secret",
            protection: "pkce",
            profile(profile : any, tokens : any) {
                return {
                    id: profile.sub,
                    sub: profile.sub,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    image: profile.image,
                    role: profile.role
                }
            },
        }
    ],

    callbacks: {
        async jwt({ token, account } : any) {
            if (account) {
                token.accessToken = account.access_token ?? "";
                token.idToken = account.id_token ?? "";
                token.sub = account.sub ?? "";
                token.role = account.role ?? "";
                token.refresh_token = account.refresh_token;
                token.expires_at = account.expires_in;
            }

            const now = Math.floor(Date.now());
            if (token.exp && now < token.exp * 1000) return token;

            console.log("[AUTH]: Refreshing token");

            try {

                const reqBody = new URLSearchParams({
                    client_id: "talapker-nextjs",
                    client_secret: "talapker-nextjs-secret",
                    grant_type: "refresh_token",
                    refresh_token: token.refresh_token
                });

                const response = await axios.post(
                    `${process.env.IDENTITY_URL}/connect/token`,
                    reqBody,
                    {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                    }
                );


                const refreshed = response.data;

                if (response.status != 200) throw refreshed;

                console.log("[AUTH]: Successfully refreshed token!");

                const decoded = jwtDecode(refreshed.access_token)

                token.accessToken = refreshed.access_token;
                token.idToken = refreshed.id_token;
                token.refresh_token = refreshed.refresh_token;
                token.exp = decoded.exp! * 1000

                return token;
            } catch (error) {
                console.error("[AUTH]: Refresh token failed", error);
                return { ...token, error: "RefreshAccessTokenError" };
            }
        },

        async session({ session, token } : any) {
            if (!token.accessToken || !token.idToken) {
                return session;
            }

            const decoded = jwtDecode(token.accessToken)
            const idTokenDecoded : IdTokenType = jwtDecode(token.idToken)

            session.user = {
                sub: decoded.sub,
                firstName: idTokenDecoded.firstName ?? "",
                lastName: idTokenDecoded.lastName ?? "",
                email: idTokenDecoded.email ?? "",
                image: `${generateS3UrlFromKey(idTokenDecoded.image)}`,
                name: `${idTokenDecoded.firstName ?? ""} ${idTokenDecoded.lastName ?? ""}`.trim(),
                role: idTokenDecoded.role,
            };

            session.exp = decoded.exp! * 1000
            session.accessToken = token.accessToken;
            session.idToken = token.idToken;
            session.refresh_token = token.refresh_token;

            return session;
        }
    },

    session: {
        strategy: 'jwt',
    },
    events: {
        async signOut({ token } : {token: any}) {
            localStorage.removeItem("notifyToken");
        },
    }
}