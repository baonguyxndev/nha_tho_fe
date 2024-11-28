'use server'
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { sendRequest } from "../api";

export const handleCreateCategoryAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: { ...data }
    })
    revalidateTag("list-categories")
    return res;
}

export const handleUpdateCategoryAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: { ...data }
    })
    revalidateTag("list-categories")
    return res;
}

export const handleDeleteCategoryAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
    })

    revalidateTag("list-categories")
    return res;
}