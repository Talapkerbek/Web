import NextAuth from "next-auth"
import {authOptions} from "@/lib/auth/authOptions";

// @ts-ignore
export default (req, res) => NextAuth(req, res, authOptions)