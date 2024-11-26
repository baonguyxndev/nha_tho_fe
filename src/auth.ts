import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InactiveAccountError, InvalidEmailPasswordError } from "./utils/error";
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
                    body: {
                        email: credentials.email,
                        password: credentials.password
                    }

                })
                if (!res.statusCode) {
                    return {
                        _id: res.data?.user?._id,
                        name: res.data?.user?.name,
                        email: res.data?.user?.email,
                        accessToken: res.data?.accessToken,

                    };
                }

                else if (+res.statusCode === 401) {
                    throw new InvalidEmailPasswordError()//trả về code 401 là sai pass/email
                }
                else if (+res.statusCode === 400) {
                    throw new InactiveAccountError()// trả về code 400 là email chưa active
                }
                else {
                    throw new Error("Internal Server Error!!!")
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.user = (user as IUser);
            }
            return token
        },
        session({ session, token }) {
            (session.user as IUser) = token.user;
            return session
        },
    },
})