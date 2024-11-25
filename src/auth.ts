import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null;

                user = {
                    _id: "123",
                    name: "test",
                    email: "test",
                    accessToken: "123",
                    isVerify: true,
                    type: "123",
                    role: "123",
                };

                if (!user) {
                    throw new Error("user not found")
                }
                return user;
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
})