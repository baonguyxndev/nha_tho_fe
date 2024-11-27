'use server'
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { sendRequest } from "../api";

export const handleCreateBookAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: { ...data }
    })
    revalidateTag("list-books")
    return res;
}

export const handleUpdateBookAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: { ...data }
    })
    revalidateTag("list-books")
    return res;
}

export const handleDeleteBookAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
    })

    revalidateTag("list-books")
    return res;
}