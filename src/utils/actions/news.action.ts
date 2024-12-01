'use server'
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { sendRequest, sendRequestFile } from "../api";

export const handleCreateNewsAction = async (data: FormData) => {
    const session = await auth();
    const res = await sendRequestFile<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: data, // Dữ liệu sẽ là FormData
    });

    revalidateTag('list-news');
    return res;
};



export const handleUpdateNewsAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequestFile<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news`,
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: data,
    });

    revalidateTag('list-news');
    return res;
}

export const handleDeleteNewsAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
    })

    revalidateTag("list-news")
    return res;
}