'use server'
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { sendRequest } from "../api";

export const handleCreateBibleVersionAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bible-versions`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: { ...data }
    })
    revalidateTag("list-bible-versions")
    return res;
}

export const handleUpdateBibleVersionAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bible-versions`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: { ...data }
    })
    revalidateTag("list-bible-versions")
    return res;
}

export const handleDeleteBibleVersionAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bible-versions/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
    })
    revalidateTag("list-bible-versions")
    return res;
}