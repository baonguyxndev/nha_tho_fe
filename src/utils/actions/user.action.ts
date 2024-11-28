'use server'
import { auth, signIn } from "@/auth";
import { sendRequest } from "../api";
import { revalidateTag } from "next/cache";

export async function authenticate(email: string, password: string) {
    try {
        const r = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        })
        return r
    } catch (error) {
        if ((error as any).name === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1
            }
        } else if ((error as any).name === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2
            }
        } else {
            return {
                error: "Internal Server Error",
                code: 0
            }
        }
    }
}

export const handleCreateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}

export const handleUpdateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}

export const handleDeleteUserAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
    })

    revalidateTag("list-users")
    return res;
}