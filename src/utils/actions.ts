'use server'
import { signIn } from "@/auth";

export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: username,
            password: password,
            redirect: false,
        })
        return r
    } catch (error) {
        return { "error": "Email hoặc mật khẩu không đúng" }
    }
}